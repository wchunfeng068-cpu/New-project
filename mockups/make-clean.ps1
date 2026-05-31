Add-Type -AssemblyName System.Drawing

$root = Get-Location
$mockups = Join-Path $root 'mockups'
New-Item -ItemType Directory -Force -Path $mockups | Out-Null

function New-RoundPath {
  param([float]$x,[float]$y,[float]$w,[float]$h,[float]$r)
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $path.StartFigure()
  $path.AddArc($x,$y,$d,$d,180,90)
  $path.AddArc($x+$w-$d,$y,$d,$d,270,90)
  $path.AddArc($x+$w-$d,$y+$h-$d,$d,$d,0,90)
  $path.AddArc($x,$y+$h-$d,$d,$d,90,90)
  $path.CloseFigure()
  return $path
}

function Fill-RoundRect {
  param($g,$brush,[float]$x,[float]$y,[float]$w,[float]$h,[float]$r)
  $p = New-RoundPath $x $y $w $h $r
  $g.FillPath($brush,$p)
  $p.Dispose()
}

function Draw-RoundRect {
  param($g,$brush,$pen,[float]$x,[float]$y,[float]$w,[float]$h,[float]$r)
  $p = New-RoundPath $x $y $w $h $r
  if ($brush) { $g.FillPath($brush,$p) }
  if ($pen) { $g.DrawPath($pen,$p) }
  $p.Dispose()
}

function Draw-ImageCover {
  param($g,[string]$path,[float]$x,[float]$y,[float]$w,[float]$h)
  $img = [System.Drawing.Image]::FromFile($path)
  try {
    $srcRatio = $img.Width / $img.Height
    $dstRatio = $w / $h
    if ($srcRatio -gt $dstRatio) {
      $cropW = [int][Math]::Round($img.Height * $dstRatio)
      $cropH = $img.Height
      $sx = [int](($img.Width - $cropW) / 2)
      $sy = 0
    } else {
      $cropW = $img.Width
      $cropH = [int][Math]::Round($img.Width / $dstRatio)
      $sx = 0
      $sy = [int](($img.Height - $cropH) / 2)
    }
    $src = New-Object System.Drawing.Rectangle($sx,$sy,$cropW,$cropH)
    $dst = New-Object System.Drawing.RectangleF($x,$y,$w,$h)
    $g.DrawImage($img,$dst,$src,[System.Drawing.GraphicsUnit]::Pixel)
  } finally {
    $img.Dispose()
  }
}

function Draw-TextBlock {
  param($g,[string]$text,$font,$brush,[float]$x,[float]$y,[float]$w,[float]$h,[string]$align='Near',[string]$line='Near',[bool]$wrap=$true)
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Alignment = [System.Drawing.StringAlignment]::$align
  $fmt.LineAlignment = [System.Drawing.StringAlignment]::$line
  $fmt.Trimming = [System.Drawing.StringTrimming]::EllipsisCharacter
  if ($wrap) { $fmt.FormatFlags = [System.Drawing.StringFormatFlags]::LineLimit }
  $rect = New-Object System.Drawing.RectangleF($x,$y,$w,$h)
  $g.DrawString($text,$font,$brush,$rect,$fmt)
  $fmt.Dispose()
}

function Draw-Pill {
  param($g,[string]$text,$font,$fill,$stroke,$textBrush,[float]$x,[float]$y,[float]$padX=18,[float]$padY=10)
  $size = $g.MeasureString($text,$font)
  $w = [float][Math]::Ceiling($size.Width + ($padX * 2))
  $h = [float][Math]::Ceiling($size.Height + ($padY * 2))
  Draw-RoundRect $g $fill $stroke $x $y $w $h 20
  Draw-TextBlock $g $text $font $textBrush $x $y $w $h 'Center' 'Center' $false
  return @{W=$w;H=$h}
}

function Make-Preview {
  param(
    [string]$OutFile,
    [string]$HeroImage,
    [string]$TitleLabel,
    [string]$Title,
    [string]$Subtitle,
    [string]$PillText,
    [string]$NoteTitle,
    [string]$NoteBody
  )

  $W = 1600; $H = 1000
  $bmp = New-Object System.Drawing.Bitmap($W, $H, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  try {
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      (New-Object System.Drawing.RectangleF(0,0,$W,$H)),
      [System.Drawing.ColorTranslator]::FromHtml('#f8f4ee'),
      [System.Drawing.ColorTranslator]::FromHtml('#efe4d4'),
      90
    )
    $g.FillRectangle($bg,0,0,$W,$H)
    $bg.Dispose()

    $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25,35,28,20))
    Fill-RoundRect $g $shadowBrush 38 38 1524 924 34
    $shadowBrush.Dispose()

    $cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(252,250,245))
    $cardPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(228,220,209),1)
    Draw-RoundRect $g $cardBrush $cardPen 30 30 1540 940 34
    $cardBrush.Dispose(); $cardPen.Dispose()

    Draw-ImageCover $g (Join-Path $root 'images/logo-travelday.png') 88 70 170 58

    $ink = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(27,23,19))
    $muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(111,101,90))
    $gold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(211,154,0))
    $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255,255,255))
    $soft = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(245,242,236))
    $softStroke = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(224,214,202),1)

    $eyebrowFont = New-Object System.Drawing.Font('Microsoft YaHei', 12, [System.Drawing.FontStyle]::Bold)
    $titleFont = New-Object System.Drawing.Font('SimHei', 58, [System.Drawing.FontStyle]::Regular)
    $subFont = New-Object System.Drawing.Font('Microsoft YaHei', 18, [System.Drawing.FontStyle]::Regular)
    $pillFont = New-Object System.Drawing.Font('Microsoft YaHei', 12, [System.Drawing.FontStyle]::Bold)
    $noteTitleFont = New-Object System.Drawing.Font('Microsoft YaHei', 18, [System.Drawing.FontStyle]::Bold)
    $noteBodyFont = New-Object System.Drawing.Font('Microsoft YaHei', 12, [System.Drawing.FontStyle]::Regular)
    $footerFont = New-Object System.Drawing.Font('Microsoft YaHei', 10, [System.Drawing.FontStyle]::Regular)

    Draw-TextBlock $g $TitleLabel $eyebrowFont $gold 88 164 260 24 'Near' 'Near' $false
    Draw-TextBlock $g $Title $titleFont $ink 88 208 540 170 'Near' 'Near' $false
    Draw-TextBlock $g $Subtitle $subFont $muted 88 378 520 64 'Near' 'Near' $true

    Draw-Pill $g $PillText $pillFont $white $softStroke $muted 88 470 18 10 | Out-Null

    $imgX = 742; $imgY = 140; $imgW = 770; $imgH = 650
    $clip = New-RoundPath $imgX $imgY $imgW $imgH 32
    $g.SetClip($clip)
    Draw-ImageCover $g (Join-Path $root $HeroImage) $imgX $imgY $imgW $imgH
    $clip.Dispose()

    $overlayBrush = $null
    if ($TitleLabel -eq 'SOLUTION') {
      $overlayBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.RectangleF($imgX,$imgY,$imgW,$imgH)),
        [System.Drawing.Color]::FromArgb(38,28,22,18),
        [System.Drawing.Color]::FromArgb(118,28,22,18),
        90
      )
    } else {
      $overlayBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.RectangleF($imgX,$imgY,$imgW,$imgH)),
        [System.Drawing.Color]::FromArgb(42,10,28,56),
        [System.Drawing.Color]::FromArgb(120,10,28,56),
        90
      )
    }
    $g.FillRectangle($overlayBrush,$imgX,$imgY,$imgW,$imgH)
    $overlayBrush.Dispose()
    $g.ResetClip()
    Draw-RoundRect $g $null (New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(230,220,208),1)) $imgX $imgY $imgW $imgH 32

    Draw-RoundRect $g $soft $softStroke ($imgX+24) ($imgY+24) 250 40 20
    if ($TitleLabel -eq 'SOLUTION') {
      Draw-TextBlock $g 'One-stop supply chain' $pillFont $ink ($imgX+24) ($imgY+31) 250 20 'Center' 'Center' $false
    } else {
      Draw-TextBlock $g 'Coverage map' $pillFont $ink ($imgX+24) ($imgY+31) 250 20 'Center' 'Center' $false
    }

    $noteX = $imgX + $imgW - 270
    $noteY = $imgY + $imgH - 140
    Draw-RoundRect $g $white $softStroke $noteX $noteY 230 110 18
    Draw-TextBlock $g $NoteTitle $noteTitleFont $ink ($noteX+18) ($noteY+18) 194 44 'Near' 'Near' $true
    Draw-TextBlock $g $NoteBody $noteBodyFont $muted ($noteX+18) ($noteY+70) 194 26 'Near' 'Near' $true

    Draw-TextBlock $g 'TRAVELDAY' $footerFont $muted 88 928 140 20 'Near' 'Near' $false

    $g.Dispose()
    $bmp.Save((Join-Path $mockups $OutFile), [System.Drawing.Imaging.ImageFormat]::Png)
  } finally {
    $bmp.Dispose()
    $eyebrowFont.Dispose(); $titleFont.Dispose(); $subFont.Dispose(); $pillFont.Dispose(); $noteTitleFont.Dispose(); $noteBodyFont.Dispose(); $footerFont.Dispose()
    $ink.Dispose(); $muted.Dispose(); $gold.Dispose(); $white.Dispose(); $soft.Dispose(); $softStroke.Dispose()
  }
}

Make-Preview -OutFile 'solution-clean.png' -HeroImage 'images/series-production.jpg' -TitleLabel 'SOLUTION' -Title "解决买家`n找货难题" -Subtitle '把找货、协同和交付收成一条线。' -PillText '更少解释 · 更清晰的入口' -NoteTitle '一条线看清流程' -NoteBody '只保留最关键的信息'
Make-Preview -OutFile 'market-clean.png' -HeroImage 'images/server-map.jpg' -TitleLabel 'GLOBAL MARKET' -Title "把全球覆盖`n做成一张图" -Subtitle '用地图表达区域覆盖，保持画面更干净。' -PillText '区域优先 · 信息克制' -NoteTitle '地图为主' -NoteBody '只留一个核心视觉'

Write-Output 'clean PNGs generated'

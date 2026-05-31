Add-Type -AssemblyName System.Drawing

$root = Get-Location
$mockups = Join-Path $root 'mockups'
New-Item -ItemType Directory -Force -Path $mockups | Out-Null

function New-RoundPath {
  param(
    [float]$X,
    [float]$Y,
    [float]$W,
    [float]$H,
    [float]$R
  )

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $R * 2
  $path.StartFigure()
  $path.AddArc($X, $Y, $d, $d, 180, 90)
  $path.AddArc($X + $W - $d, $Y, $d, $d, 270, 90)
  $path.AddArc($X + $W - $d, $Y + $H - $d, $d, $d, 0, 90)
  $path.AddArc($X, $Y + $H - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function Draw-RoundRect {
  param(
    $G,
    $Brush,
    $Pen,
    [float]$X,
    [float]$Y,
    [float]$W,
    [float]$H,
    [float]$R
  )

  $path = New-RoundPath -X $X -Y $Y -W $W -H $H -R $R
  if ($Brush) { $G.FillPath($Brush, $path) }
  if ($Pen) { $G.DrawPath($Pen, $path) }
  $path.Dispose()
}

function Draw-ImageCover {
  param(
    $G,
    [string]$Path,
    [float]$X,
    [float]$Y,
    [float]$W,
    [float]$H
  )

  $img = [System.Drawing.Image]::FromFile($Path)
  try {
    $srcRatio = $img.Width / $img.Height
    $dstRatio = $W / $H
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
    $src = New-Object System.Drawing.Rectangle($sx, $sy, $cropW, $cropH)
    $dst = New-Object System.Drawing.RectangleF($X, $Y, $W, $H)
    $G.DrawImage($img, $dst, $src, [System.Drawing.GraphicsUnit]::Pixel)
  } finally {
    $img.Dispose()
  }
}

function Draw-TextBlock {
  param(
    $G,
    [string]$Text,
    $Font,
    $Brush,
    [float]$X,
    [float]$Y,
    [float]$W,
    [float]$H,
    [string]$Align = 'Near',
    [string]$Line = 'Near',
    [bool]$Wrap = $true
  )

  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Alignment = [System.Drawing.StringAlignment]::$Align
  $fmt.LineAlignment = [System.Drawing.StringAlignment]::$Line
  $fmt.Trimming = [System.Drawing.StringTrimming]::EllipsisCharacter
  if ($Wrap) { $fmt.FormatFlags = [System.Drawing.StringFormatFlags]::LineLimit }
  $rect = New-Object System.Drawing.RectangleF($X, $Y, $W, $H)
  $G.DrawString($Text, $Font, $Brush, $rect, $fmt)
  $fmt.Dispose()
}

function Draw-Pill {
  param(
    $G,
    [string]$Text,
    $Font,
    $Fill,
    $Stroke,
    $TextBrush,
    [float]$X,
    [float]$Y,
    [float]$PadX = 18,
    [float]$PadY = 10
  )

  $size = $G.MeasureString($Text, $Font)
  $W = [float][Math]::Ceiling($size.Width + ($PadX * 2))
  $H = [float][Math]::Ceiling($size.Height + ($PadY * 2))
  Draw-RoundRect $G $Fill $Stroke $X $Y $W $H 999
  Draw-TextBlock $G $Text $Font $TextBrush $X $Y $W $H 'Center' 'Center' $false
}

function Build-Preview {
  param(
    [string]$OutFile,
    [string]$HeroImage,
    [string]$BottomImage,
    [string]$Eyebrow,
    [string]$Title,
    [string]$Subtitle,
    [string]$PillText,
    [string]$TopLabel
  )

  $W = 1600
  $H = 1100
  $bmp = New-Object System.Drawing.Bitmap($W, $H, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)

  try {
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      (New-Object System.Drawing.RectangleF(0, 0, $W, $H)),
      [System.Drawing.ColorTranslator]::FromHtml('#f7f3ed'),
      [System.Drawing.ColorTranslator]::FromHtml('#efe4d4'),
      90
    )
    $g.FillRectangle($bg, 0, 0, $W, $H)
    $bg.Dispose()

    $panelFill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(252, 250, 245))
    $panelStroke = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(226, 218, 207), 1)
    Draw-RoundRect $g $panelFill $panelStroke 30 30 1540 1040 34
    $panelFill.Dispose()
    $panelStroke.Dispose()

    $ink = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(27, 23, 19))
    $muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(111, 101, 90))
    $gold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(211, 154, 0))
    $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 255))
    $pillFill = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(246, 243, 237))
    $pillStroke = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(224, 214, 202), 1)

    $logoFont = New-Object System.Drawing.Font('Georgia', 30, [System.Drawing.FontStyle]::Bold)
    $eyebrowFont = New-Object System.Drawing.Font('Microsoft YaHei', 12, [System.Drawing.FontStyle]::Bold)
    $titleFont = New-Object System.Drawing.Font('SimHei', 56, [System.Drawing.FontStyle]::Regular)
    $subFont = New-Object System.Drawing.Font('Microsoft YaHei', 18, [System.Drawing.FontStyle]::Regular)
    $pillFont = New-Object System.Drawing.Font('Microsoft YaHei', 12, [System.Drawing.FontStyle]::Bold)
    $smallFont = New-Object System.Drawing.Font('Microsoft YaHei', 10, [System.Drawing.FontStyle]::Regular)
    $bottomFont = New-Object System.Drawing.Font('Microsoft YaHei', 16, [System.Drawing.FontStyle]::Bold)

    Draw-TextBlock $g 'TRAVELDAY' $logoFont $gold 88 68 260 44 'Near' 'Near' $false
    Draw-TextBlock $g $Eyebrow $eyebrowFont $gold 88 166 250 24 'Near' 'Near' $false
    Draw-TextBlock $g $Title $titleFont $ink 88 214 560 170 'Near' 'Near' $false
    Draw-TextBlock $g $Subtitle $subFont $muted 88 386 520 64 'Near' 'Near' $true
    Draw-Pill $g $PillText $pillFont $white $pillStroke $muted 88 478 18 10

    $topX = 742
    $topY = 140
    $topW = 770
    $topH = 500
    $topClip = New-RoundPath -X $topX -Y $topY -W $topW -H $topH -R 30
    $g.SetClip($topClip)
    Draw-ImageCover $g (Join-Path $root $HeroImage) $topX $topY $topW $topH
    $overlay = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      (New-Object System.Drawing.RectangleF($topX, $topY, $topW, $topH)),
      [System.Drawing.Color]::FromArgb(42, 25, 20, 16),
      [System.Drawing.Color]::FromArgb(120, 25, 20, 16),
      90
    )
    $g.FillRectangle($overlay, $topX, $topY, $topW, $topH)
    $overlay.Dispose()
    $g.ResetClip()
    Draw-RoundRect $g $null (New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(230, 220, 208), 1)) $topX $topY $topW $topH 30
    $topClip.Dispose()

    Draw-RoundRect $g $pillFill $pillStroke ($topX + 24) ($topY + 24) 250 40 20
    Draw-TextBlock $g $TopLabel $pillFont $ink ($topX + 24) ($topY + 31) 250 20 'Center' 'Center' $false

    $bottomX = 88
    $bottomY = 700
    $bottomW = 1440
    $bottomH = 260
    $bottomClip = New-RoundPath -X $bottomX -Y $bottomY -W $bottomW -H $bottomH -R 26
    $g.SetClip($bottomClip)
    Draw-ImageCover $g (Join-Path $root $BottomImage) $bottomX $bottomY $bottomW $bottomH
    $bottomOverlay = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      (New-Object System.Drawing.RectangleF($bottomX, $bottomY, $bottomW, $bottomH)),
      [System.Drawing.Color]::FromArgb(20, 255, 255, 255),
      [System.Drawing.Color]::FromArgb(60, 255, 255, 255),
      0
    )
    $g.FillRectangle($bottomOverlay, $bottomX, $bottomY, $bottomW, $bottomH)
    $bottomOverlay.Dispose()
    $g.ResetClip()
    Draw-RoundRect $g $null (New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(224, 214, 202), 1)) $bottomX $bottomY $bottomW $bottomH 26
    $bottomClip.Dispose()

    Draw-TextBlock $g '下方再补一张图' $bottomFont $ink 118 714 260 26 'Near' 'Near' $false
    Draw-TextBlock $g '去掉说明，只保留第二张视觉图。' $smallFont $muted 118 748 320 20 'Near' 'Near' $false

    Draw-TextBlock $g 'TRAVELDAY' $smallFont $muted 88 1000 120 16 'Near' 'Near' $false
  }
  finally {
    $g.Dispose()
    $bmp.Save((Join-Path $mockups $OutFile), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()

    $ink.Dispose()
    $muted.Dispose()
    $gold.Dispose()
    $white.Dispose()
    $pillFill.Dispose()
    $pillStroke.Dispose()
    $logoFont.Dispose()
    $eyebrowFont.Dispose()
    $titleFont.Dispose()
    $subFont.Dispose()
    $pillFont.Dispose()
    $smallFont.Dispose()
    $bottomFont.Dispose()
  }
}

Build-Preview `
  -OutFile 'solution-requested.png' `
  -HeroImage 'images/series-production.jpg' `
  -BottomImage 'images/luggage-components.jpg' `
  -Eyebrow 'SOLUTION' `
  -Title "解决买家`n找货难题" `
  -Subtitle '把找货、协同和交付收成一条线。' `
  -PillText '更少解释 · 更清晰的入口' `
  -TopLabel 'One-stop supply chain'

Build-Preview `
  -OutFile 'market-requested.png' `
  -HeroImage 'images/server-map.jpg' `
  -BottomImage 'images/server-map111.jpg' `
  -Eyebrow 'GLOBAL MARKET' `
  -Title "把全球覆盖`n做成一张图" `
  -Subtitle '用地图表达区域覆盖，保持画面更干净。' `
  -PillText '区域优先 · 信息克制' `
  -TopLabel 'Coverage map'

Write-Output 'requested PNGs generated'

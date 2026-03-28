Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("public\dashboard-light.png")
$cropHeight = $img.Height - 65
$bmp = New-Object System.Drawing.Bitmap $img.Width, $cropHeight
$g = [System.Drawing.Graphics]::FromImage($bmp)
$destRect = New-Object System.Drawing.Rectangle 0, 0, $bmp.Width, $bmp.Height
$srcRect = New-Object System.Drawing.Rectangle 0, 0, $img.Width, $cropHeight
$g.DrawImage($img, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$img.Dispose()
$bmp.Save("public\dashboard-light-tmp.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Remove-Item "public\dashboard-light.png" -Force
Rename-Item "public\dashboard-light-tmp.png" "dashboard-light.png"

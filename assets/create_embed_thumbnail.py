import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def draw_play_icon(draw, cx, cy, size, color):
    # Draw a clean equilateral play triangle
    half_h = size / 2.0
    half_w = (size * 0.866) / 2.0
    pts = [
        (cx - half_w, cy - half_h),
        (cx - half_w, cy + half_h),
        (cx + half_w, cy)
    ]
    draw.polygon(pts, fill=color)

def create_embed_player():
    base = Image.open('assets/youtube_thumb.jpg').convert('RGBA')
    w, h = base.size # 1280 x 720

    # Create an overlay layer for top & bottom gradients
    overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    draw_ov = ImageDraw.Draw(overlay)

    # 1. Top gradient bar (just like YouTube embed: dark at top fading out)
    grad_height = 150
    for y in range(grad_height):
        alpha = int(190 * (1.0 - (y / grad_height) ** 1.2))
        draw_ov.line([(0, y), (w, y)], fill=(0, 0, 0, alpha))

    # 2. Bottom subtle gradient (video player control background)
    bot_height = 70
    for y in range(bot_height):
        alpha = int(160 * ((y / bot_height) ** 1.3))
        draw_ov.line([(0, h - bot_height + y), (w, h - bot_height + y)], fill=(0, 0, 0, alpha))

    # Composite gradient onto base
    base = Image.alpha_composite(base, overlay)
    draw = ImageDraw.Draw(base)

    # 3. Fonts
    try:
        font_title = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 26, index=0)
        font_sub = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 15, index=0)
        font_btn = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 14, index=1)
    except:
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_btn = ImageFont.load_default()

    # 4. Top-left: Channel Avatar + Title
    try:
        logo = Image.open('assets/logo.png').convert('RGBA')
        logo.thumbnail((46, 46), Image.Resampling.LANCZOS)
        mask = Image.new('L', (46, 46), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.ellipse((0, 0, 46, 46), fill=255)
        # Background circle
        draw.ellipse((26, 18, 26 + 48, 18 + 48), fill=(20, 24, 33, 240), outline=(255, 255, 255, 70), width=1)
        base.paste(logo, (27, 19), mask)
    except Exception as e:
        print('Logo error:', e)

    # Title text with subtle drop shadow
    title_text = "KEYSTONE — Software Supply Chain Intelligence Platform Demo"
    draw.text((88, 20), title_text, fill=(0, 0, 0, 200), font=font_title)
    draw.text((86, 18), title_text, fill=(255, 255, 255, 255), font=font_title)

    sub_text = "KEYSTONE • Full Video Walkthrough"
    draw.text((88, 50), sub_text, fill=(0, 0, 0, 160), font=font_sub)
    draw.text((87, 49), sub_text, fill=(210, 215, 225, 230), font=font_sub)

    # Top-right: "Watch on YouTube" button pill
    share_box = (w - 180, 22, w - 26, 56)
    draw.rounded_rectangle(share_box, radius=17, fill=(20, 20, 20, 180), outline=(255, 255, 255, 80), width=1)
    draw_play_icon(draw, w - 162, 39, 11, (255, 60, 60, 255))
    draw.text((w - 148, 30), "Watch on YouTube", fill=(255, 255, 255, 240), font=font_btn)

    # 5. Center YouTube Play Button (Iconic YouTube Embed Style)
    btn_w = 110
    btn_h = 76
    btn_x = (w - btn_w) // 2
    btn_y = (h - btn_h) // 2

    # Drop shadow for center button
    shadow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle(
        (btn_x - 3, btn_y + 3, btn_x + btn_w + 3, btn_y + btn_h + 9),
        radius=22,
        fill=(0, 0, 0, 160)
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(10))
    base = Image.alpha_composite(base, shadow)
    draw = ImageDraw.Draw(base)

    # YouTube Red Button (#FF0000 with 95% opacity)
    draw.rounded_rectangle(
        (btn_x, btn_y, btn_x + btn_w, btn_y + btn_h),
        radius=22,
        fill=(255, 0, 0, 245)
    )

    # Center white play arrow
    arrow_size = 32
    draw_play_icon(draw, btn_x + (btn_w // 2) + 3, btn_y + (btn_h // 2), arrow_size, (255, 255, 255, 255))

    # 6. Bottom video controls bar
    # Red scrubber line at bottom
    draw.rectangle((0, h - 4, w, h), fill=(60, 60, 60, 220))
    draw.rectangle((0, h - 4, int(w * 0.28), h), fill=(255, 0, 0, 255))
    draw.ellipse((int(w * 0.28) - 5, h - 8, int(w * 0.28) + 5, h + 2), fill=(255, 0, 0, 255))

    # Bottom left: play icon + duration
    draw_play_icon(draw, 34, h - 25, 14, (255, 255, 255, 240))
    draw.text((48, h - 33), "0:00 / 3:45", fill=(255, 255, 255, 230), font=font_sub)

    # Bottom right: YouTube branding
    yt_box = (w - 110, h - 42, w - 24, h - 14)
    draw.rounded_rectangle(yt_box, radius=6, fill=(0, 0, 0, 140), outline=(255, 255, 255, 30), width=1)
    # Mini play icon in red
    draw_play_icon(draw, w - 96, h - 28, 10, (255, 50, 50, 255))
    draw.text((w - 86, h - 35), "YouTube", fill=(255, 255, 255, 240), font=font_btn)

    # Save images
    base_rgb = base.convert('RGB')
    base_rgb.save('assets/youtube_embed_player.png', 'PNG', quality=95)
    base_rgb.save('assets/youtube_embed_player.jpg', 'JPEG', quality=92)
    print('Generated assets/youtube_embed_player.png and assets/youtube_embed_player.jpg')

if __name__ == '__main__':
    create_embed_player()

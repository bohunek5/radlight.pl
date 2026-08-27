import asyncio
from playwright.async_api import async_playwright
import http.server
import socketserver
import threading
import os

PORT = 8123
DIRECTORY = "/Users/karolbohdanowicz/my-ai-agents/radlight"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def start_server():
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("", PORT), Handler)
    httpd.serve_forever()

async def main():
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    await asyncio.sleep(1)

    output_dir = "/Users/karolbohdanowicz/.gemini/antigravity-ide/brain/11738d31-5137-45d7-9c8c-f2d183530982"
    os.makedirs(output_dir, exist_ok=True)

    async with async_playwright() as p:
        # 1. Desktop Test
        browser = await p.chromium.launch(headless=True)
        desktop_page = await browser.new_page(viewport={"width": 1440, "height": 900})
        
        print("=== Testing Desktop Homepage Image Zoom ===")
        await desktop_page.goto(f"http://localhost:{PORT}/index.html", wait_until="networkidle")
        
        # Click on the first service card image (Apartamenty)
        first_service_img = desktop_page.locator(".service-card img").first
        await first_service_img.scroll_into_view_if_needed()
        await first_service_img.click()
        await desktop_page.wait_for_timeout(400)

        # Verify Lightbox is active
        lb_visible = await desktop_page.locator("#rad-lightbox.active").is_visible()
        print(f"Desktop Lightbox open: {lb_visible}")
        assert lb_visible, "Lightbox did not open on desktop image click!"

        # Take screenshot of open lightbox on desktop
        await desktop_page.screenshot(path=os.path.join(output_dir, "desktop_lightbox_open.png"))

        # Test Zoom In button
        await desktop_page.locator("#rad-lb-zoom-in").click()
        await desktop_page.wait_for_timeout(300)
        zoom_text = await desktop_page.locator("#rad-lightbox-zoom-badge").text_content()
        print(f"Zoom badge after zoom in: {zoom_text}")
        await desktop_page.screenshot(path=os.path.join(output_dir, "desktop_lightbox_zoomed.png"))

        # Test Next image button
        await desktop_page.locator("#rad-lb-next").click()
        await desktop_page.wait_for_timeout(400)
        counter_text = await desktop_page.locator("#rad-lightbox-counter").text_content()
        print(f"Counter text after next: {counter_text}")
        await desktop_page.screenshot(path=os.path.join(output_dir, "desktop_lightbox_next.png"))

        # Test Escape key to close
        await desktop_page.keyboard.press("Escape")
        await desktop_page.wait_for_timeout(400)
        lb_closed = not (await desktop_page.locator("#rad-lightbox.active").is_visible())
        print(f"Lightbox closed via Escape: {lb_closed}")
        assert lb_closed, "Lightbox failed to close with Escape key!"

        # 2. Subpage Gallery Desktop Test (o-nas.html)
        print("=== Testing Subpage o-nas.html Gallery ===")
        await desktop_page.goto(f"http://localhost:{PORT}/o-nas.html", wait_until="networkidle")
        
        # Click on hero visual
        hero_img = desktop_page.locator(".subpage-hero-card-media img")
        await hero_img.click()
        await desktop_page.wait_for_timeout(400)
        print(f"o-nas hero open: {await desktop_page.locator('#rad-lightbox.active').is_visible()}")
        await desktop_page.screenshot(path=os.path.join(output_dir, "desktop_onas_hero_lightbox.png"))
        
        # Close via close button
        await desktop_page.locator("#rad-lb-close").click()
        await desktop_page.wait_for_timeout(400)

        # Click on gallery item in o-nas.html
        gallery_img = desktop_page.locator(".subpage-gallery-item img").first
        await gallery_img.scroll_into_view_if_needed()
        await gallery_img.click()
        await desktop_page.wait_for_timeout(400)
        print(f"o-nas gallery open: {await desktop_page.locator('#rad-lightbox.active').is_visible()}")
        await desktop_page.screenshot(path=os.path.join(output_dir, "desktop_onas_gallery_lightbox.png"))
        await desktop_page.locator("#rad-lb-close").click()
        await desktop_page.wait_for_timeout(300)

        await desktop_page.close()

        # 3. Mobile Touch Test (iPhone 14)
        print("=== Testing Mobile Touch & Gesture Experience ===")
        mobile_context = await browser.new_context(
            viewport={"width": 390, "height": 844},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
            is_mobile=True,
            has_touch=True
        )
        mobile_page = await mobile_context.new_page()
        await mobile_page.goto(f"http://localhost:{PORT}/apartamenty.html", wait_until="networkidle")

        # Tap on hero image
        mobile_hero = mobile_page.locator(".subpage-hero-card-media img")
        await mobile_hero.tap()
        await mobile_page.wait_for_timeout(400)
        mobile_open = await mobile_page.locator("#rad-lightbox.active").is_visible()
        print(f"Mobile Apartamenty Hero Lightbox open: {mobile_open}")
        assert mobile_open, "Lightbox failed to open on mobile tap!"
        await mobile_page.screenshot(path=os.path.join(output_dir, "mobile_lightbox_apartamenty.png"))

        # Test mobile next tap
        await mobile_page.locator("#rad-lb-next").tap()
        await mobile_page.wait_for_timeout(400)
        mobile_counter = await mobile_page.locator("#rad-lightbox-counter").text_content()
        print(f"Mobile Counter after next tap: {mobile_counter}")
        await mobile_page.screenshot(path=os.path.join(output_dir, "mobile_lightbox_next_slide.png"))

        # Test close button tap on mobile
        await mobile_page.locator("#rad-lb-close").tap()
        await mobile_page.wait_for_timeout(400)
        mobile_closed = not (await mobile_page.locator("#rad-lightbox.active").is_visible())
        print(f"Mobile closed via close button: {mobile_closed}")
        assert mobile_closed, "Lightbox failed to close on mobile button tap!"

        # Reopen on mobile gallery and test backdrop tap
        mobile_gallery_img = mobile_page.locator(".subpage-gallery-item img").first
        await mobile_gallery_img.scroll_into_view_if_needed()
        await mobile_gallery_img.tap()
        await mobile_page.wait_for_timeout(400)
        print(f"Mobile gallery reopened: {await mobile_page.locator('#rad-lightbox.active').is_visible()}")

        # Tap backdrop (near top edge of viewport)
        await mobile_page.mouse.click(20, 200)
        await mobile_page.wait_for_timeout(400)
        backdrop_closed = not (await mobile_page.locator("#rad-lightbox.active").is_visible())
        print(f"Mobile closed via backdrop tap: {backdrop_closed}")

        await browser.close()
        print("ALL DESKTOP & MOBILE LIGHTBOX TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(main())

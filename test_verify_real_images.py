import asyncio
from playwright.async_api import async_playwright
import http.server
import socketserver
import threading
import os

PORT = 8130
DIRECTORY = "/Users/karolbohdanowicz/my-ai-agents"

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

    output_dir = "/Users/karolbohdanowicz/.gemini/antigravity-ide/brain/a1190e37-c0f5-4af0-ade9-a02d1501a425"
    os.makedirs(output_dir, exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        # 1. Pralnia
        await page.goto(f"http://localhost:{PORT}/pralnia.html", wait_until="networkidle")
        await page.screenshot(path=os.path.join(output_dir, "v_real_pralnia.png"), full_page=False)

        # 2. Sprzątanie
        await page.goto(f"http://localhost:{PORT}/sprzatanie.html", wait_until="networkidle")
        await page.screenshot(path=os.path.join(output_dir, "v_real_sprzatanie.png"), full_page=False)

        # 3. Magazyny
        await page.goto(f"http://localhost:{PORT}/magazyny.html", wait_until="networkidle")
        await page.screenshot(path=os.path.join(output_dir, "v_real_magazyny.png"), full_page=False)

        # 4. Helipad
        await page.goto(f"http://localhost:{PORT}/helipad.html", wait_until="networkidle")
        await page.screenshot(path=os.path.join(output_dir, "v_real_helipad.png"), full_page=False)

        # 5. Zimowanie
        await page.goto(f"http://localhost:{PORT}/zimowanie-jachtow.html", wait_until="networkidle")
        await page.screenshot(path=os.path.join(output_dir, "v_real_zimowanie.png"), full_page=False)

        await browser.close()
        print("All real images screenshots verified!")

if __name__ == "__main__":
    asyncio.run(main())

import re


def clean_price(raw: str) -> float:
    if not raw:
        return 0.0
    cleaned = re.sub(r"[^\d,.]", "", raw)
    if "," in cleaned:
        cleaned = cleaned.replace(".", "").replace(",", ".")
    else:
        cleaned = cleaned.replace(".", "")
    try:
        return float(cleaned)
    except ValueError:
        return 0.0


def clean_text(raw: str) -> str:
    return re.sub(r"\s+", " ", raw).strip()


def extract_sku_from_url(url: str) -> str:
    match = re.search(r"/p/(\w+)", url)
    if match:
        return match.group(1)
    match = re.search(r"[?&]id=(\w+)", url)
    if match:
        return match.group(1)
    parts = url.rstrip("/").split("/")
    return parts[-1] if parts else ""
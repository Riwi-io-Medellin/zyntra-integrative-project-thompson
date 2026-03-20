import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ai.agent import ShoppingAgent

STORES = ["exito", "alkosto", "ktronix", "d1"]

async def main():
    agent = ShoppingAgent()
    print("\n🛒  Buscador de productos Colombia")
    print("   Tiendas: Éxito · Alkosto · Ktronix · D1")
    print("─" * 45)

    while True:
        query = input("\n¿Qué quieres comprar? (o 'salir'): ").strip()
        if query.lower() in ("salir", "exit", "q"):
            print("¡Hasta luego!")
            break
        if not query:
            continue

        print("\n⏳ Buscando en todas las tiendas, espera...\n")
        result = await agent.search(query, max_results_per_store=5, stores=STORES)

        # ── Análisis IA ──────────────────────────────────
        analysis = result.get("analysis", {})
        if analysis.get("summary"):
            print("🤖 Análisis IA:")
            print(f"   {analysis['summary']}\n")

        best = analysis.get("best_deal")
        if best:
            print(f"💰 Mejor precio encontrado:")
            print(f"   {best['name']}")
            print(f"   {best['store'].upper()} → ${best['price']:,.0f} COP")
            print(f"   {best['url']}\n")

        # ── Productos por tienda ─────────────────────────
        products = result.get("products", [])
        if products:
            # Agrupar por tienda
            by_store = {}
            for p in products:
                by_store.setdefault(p["store"], []).append(p)

            print(f"📦 {len(products)} productos en {len(by_store)} tienda(s):\n")

            for store, items in by_store.items():
                print(f"  🏪 {store.upper()}")
                for i, p in enumerate(items, 1):
                    discount = ""
                    if p.get("original_price") and p["original_price"] > p["price"]:
                        pct = int((1 - p["price"] / p["original_price"]) * 100)
                        discount = f" (-{pct}%)"
                    print(f"    {i}. {p['name'][:55]}")
                    print(f"       ${p['price']:,.0f} COP{discount}")
                    print(f"       {p['url'][:65]}")
                print()
        else:
            print(" No se encontraron productos.")

        # ── Errores por tienda ───────────────────────────
        errors = result.get("errors", {})
        if errors:
            print("  Tiendas con error:")
            for store, err in errors.items():
                print(f"   {store}: {err}")

asyncio.run(main())
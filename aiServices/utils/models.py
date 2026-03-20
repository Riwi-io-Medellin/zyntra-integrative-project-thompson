from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Product:
    store:          str
    name:           str
    price:          float
    original_price: Optional[float] = None
    currency:       str             = "COP"
    url:            str             = ""
    image_url:      str             = ""
    sku:            str             = ""
    brand:          str             = ""
    category:       str             = ""
    in_stock:       bool            = True
    rating:         Optional[float] = None
    reviews_count:  int             = 0
    extra:          dict            = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "store":          self.store,
            "name":           self.name,
            "price":          self.price,
            "original_price": self.original_price,
            "currency":       self.currency,
            "url":            self.url,
            "image_url":      self.image_url,
            "sku":            self.sku,
            "brand":          self.brand,
            "category":       self.category,
            "in_stock":       self.in_stock,
            "rating":         self.rating,
            "reviews_count":  self.reviews_count,
            "extra":          self.extra,
        }


@dataclass
class SearchResult:
    query:    str
    products: list[Product]
    errors:   dict[str, str] = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "query":    self.query,
            "products": [p.to_dict() for p in self.products],
            "errors":   self.errors,
            "total":    len(self.products),
        }
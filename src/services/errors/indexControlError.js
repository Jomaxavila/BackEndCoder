import EError from "./enums.js";

export default (error, req, res, next) => {
  console.log(error.cause);

  switch (error.code) {
    case EError.ROUTINE_ERROR:
      res.status(500).json({ status: "Error", error: "Routine error" });
      break;
    case EError.INVALID_TYPES_ERROR:
      res.status(400).json({ status: "Error", error: "Invalid types" });
      break;
    case EError.DATABASE_ERROR:
      res.status(500).json({ status: "Error", error: "Database error" });
      break;
    case EError.PRODUCT_NOT_FOUND:
      res.status(404).json({ status: "Error", error: "Product not found" });
      break;
    case EError.PRODUCT_CREATION_ERROR:
      res.status(500).json({ status: "Error", error: "Product creation failed" });
      break;
    case EError.PRODUCT_UPDATE_ERROR:
      res.status(500).json({ status: "Error", error: "Product update failed" });
      break;
    case EError.PRODUCT_DELETION_ERROR:
      res.status(500).json({ status: "Error", error: "Product deletion failed" });
      break;
    case EError.CART_NOT_FOUND:
      res.status(404).json({ status: "Error", error: "Cart not found" });
      break;
    case EError.CART_CREATION_ERROR:
      res.status(500).json({ status: "Error", error: "Cart creation failed" });
      break;
    case EError.ADD_PRODUCT_TO_CART_ERROR:
      res.status(500).json({ status: "Error", error: "Add product to cart failed" });
      break;
    case EError.REMOVE_PRODUCT_FROM_CART_ERROR:
      res.status(500).json({ status: "Error", error: "Remove product from cart failed" });
      break;
    case EError.COMPLETE_CART_ERROR:
      res.status(500).json({ status: "Error", error: "Complete cart failed" });
      break;
    default:
      res.status(500).json({ status: "Error", error: "Error desconocido" });
  }
}

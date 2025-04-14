import ProductDetail from "../Products/ProductDetails";
import Footer from "./Footer";
import UserNav from "./UserNav";
function ProductView() {
  return (
    <div>
      <UserNav />
      <ProductDetail />
      <Footer />
    </div>
  );
}

export default ProductView;

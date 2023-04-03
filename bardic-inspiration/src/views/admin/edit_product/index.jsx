import { LoadingOutlined } from "@ant-design/icons";
import { useDocumentTitle, useProduct, useScrollTop } from "../../../hooks";
import PropType from "prop-types";
import React, { lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { withRouter } from "../../../helpers/utils";
import { editProduct } from "../../../redux/actions/productActions";
import { useParams } from "react-router-dom";

const ProductForm = lazy(() => import("../components/ProductForm"));

const EditProduct = () => {
  const params = useParams();
  useDocumentTitle("Edit Product | Bardic Inspiration");
  useScrollTop();
  const { product, error, isLoading } = useProduct(params.id);
  const dispatch = useDispatch();

  const onSubmitForm = (updates) => {
    dispatch(editProduct(product.id, updates));
  };

  return (
    <div className="product-form-container">
      {error && <Navigate to="/dashboard/products" />}
      <h2>Edit Product</h2>
      {product && (
        <Suspense
          fallback={
            <div className="loader" style={{ minHeight: "80vh" }}>
              <h6>Loading ... </h6>
              <br />
              <LoadingOutlined />
            </div>
          }
        >
          <ProductForm
            isLoading={isLoading}
            onSubmit={onSubmitForm}
            product={product}
          />
        </Suspense>
      )}
    </div>
  );
};

EditProduct.propTypes = {
  match: PropType.shape({
    params: PropType.shape({
      id: PropType.string,
    }),
  }).isRequired,
};

export default withRouter(EditProduct);

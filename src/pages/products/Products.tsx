import "./Products.css";
import axios from "axios";
import {
  Button,
  Container,
  FormControl,
  InputGroup,
  Modal,
} from "react-bootstrap";
import defaultImage from "../../assets/default_img.png";
import type { ProductType } from "../../types/Types";
import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState<Array<ProductType>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 8;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          "https://web-production-3ca4c.up.railway.app/api/items",
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <Container>
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Body className="text-center p-modal">
          <p className="fs-5 fw-bold mb-4">
            ARE YOU SURE YOU WANT TO DELETE THE PRODUCT?
          </p>
          <div className="d-flex justify-content-between">
            <Button
              className="border-0 px-4 my-btn-delete w-80px"
              onClick={async () => {
                if (selectedProductId !== null) {
                  try {
                    const token = localStorage.getItem("token");
                    await axios.delete(
                      `https://web-production-3ca4c.up.railway.app/api/items/${selectedProductId}`,
                      {
                        headers: {
                          Accept: "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );

                    setProducts((prevProducts) => {
                      const updatedProducts = prevProducts.filter(
                        (product) => product.id !== selectedProductId
                      );

                      const updatedFiltered = updatedProducts.filter(
                        (product) =>
                          product.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                      );

                      const newTotalPages = Math.ceil(
                        updatedFiltered.length / productsPerPage
                      );

                      if (currentPage > newTotalPages) {
                        setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
                      }

                      return updatedProducts;
                    });

                    toast.success("Product deleted successfully!", {
                      position: "top-center",
                      autoClose: 2000,
                    });
                  } catch (error) {
                    console.error("Failed to delete:", error);
                  }
                }
                setShowConfirm(false);
              }}
            >
              Yes
            </Button>
            <Button
              className="px-4 my-btn-delete w-80px"
              onClick={() => setShowConfirm(false)}
            >
              No
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <InputGroup className="mb-3 rounded-2 mt-2 p-relative d-flex m-auto align-items-stretch">
        <FormControl
          placeholder="Search product by name"
          aria-label="search"
          aria-describedby="button-search"
          className="border-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button className="bg-white border-0">
          <CiSearch className="text-black-50" />
        </Button>
      </InputGroup>

      <div className="d-flex justify-content-end w-right  my-4 mx-auto">
        <Link
          to={"/dashboard/add"}
          className="border-0 rightBtnAdd text-white text-decoration-none rounded-1 text-center"
        >
          ADD NEW PRODUCT
        </Link>
      </div>

      <div className="d-flex justify-content-center flex-wrap w-100 gap-5">
        {isLoading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <ClipLoader color="#FEAF00" size={60} />
            <span className="fw-5 ms-3">Loading Products..</span>
          </div>
        ) : currentProducts.length > 0 ? (
          currentProducts.map((product: ProductType) => (
            <Link
              to={`/dashboard/show/${product?.id}`}
              key={product?.id}
              className="product_img text-decoration-none text-black"
            >
              <img
                className="w-100 h-100"
                src={product?.image_url}
                alt={product?.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = defaultImage;
                }}
              />
              <div className="product_overlay">
                <p className="fs-2 fw-2">{product?.name}</p>
                <div className="d-flex gap-1">
                  <Link
                    to={`/dashboard/edit/${product?.id}`}
                    className="Edit-button text-decoration-none border-0 outline-0 cursor-pointer text-white"
                  >
                    Edit
                  </Link>
                  <button
                    className="delete-button border-0 outline-0 cursor-pointer text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedProductId(product?.id);
                      setShowConfirm(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="w-100 text-center py-5">
            <h4 className="text-muted">Product not found</h4>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-container d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
          <button
            className="page-btn bg-light text-black rounded-circle"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <IoIosArrowBack />
          </button>

          {currentPage > 2 && (
            <>
              <button className="page-btn" onClick={() => goToPage(1)}>
                1
              </button>
              {currentPage > 3 && <span className="dots">...</span>}
            </>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (page) =>
                page === currentPage ||
                page === currentPage - 1 ||
                page === currentPage + 1
            )
            .map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`page-btn ${
                  currentPage === page ? "active-page" : ""
                }`}
              >
                {page}
              </button>
            ))}

          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && (
                <span className="dots">...</span>
              )}
              <button className="page-btn" onClick={() => goToPage(totalPages)}>
                {totalPages}
              </button>
            </>
          )}

          <button
            className="page-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <IoIosArrowForward />
          </button>
        </div>
      )}
    </Container>
  );
};

export default Products;

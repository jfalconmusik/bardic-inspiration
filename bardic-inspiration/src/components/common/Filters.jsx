/* eslint-disable no-nested-ternary */
import { useDidMount } from "../../hooks";
import PropType from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { withRouter } from "../../helpers/utils";
import {
  applyFilter,
  resetFilter,
  setTextFilter,
} from "../../redux/actions/filterActions";
import { selectMax, selectMin } from "../../selectors/selector";
import PriceRange from "./PriceRange";

const Filters = ({ closeModal }) => {
  const { filter, isLoading, products } = useSelector((state) => ({
    filter: state.filter,
    isLoading: state.app.loading,
    products: state.products.items,
  }));
  const [field, setFilter] = useState({
    keyword: filter.keyword,
    minPrice: filter.minPrice,
    maxPrice: filter.maxPrice,
    sortBy: filter.sortBy,
    brand: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const didMount = useDidMount();

  const max = selectMax(products);
  const min = selectMin(products);

  useEffect(() => {
    if (didMount && window.screen.width <= 480) {
      navigate("/");
    }

    if (didMount && closeModal) closeModal();

    setFilter(filter);
    window.scrollTo(0, 0);
  }, [filter]);

  const onPriceChange = (minVal, maxVal) => {
    setFilter({ ...field, minPrice: minVal, maxPrice: maxVal });
  };

  const onKeywordFilterChange = (e) => {
    const val = e.target.value;

    setFilter({ ...field, keyword: val });
    // setTextFilter(val);
  };

  const onSortFilterChange = (e) => {
    setFilter({ ...field, sortBy: e.target.value });
  };

  const onApplyFilter = () => {
    const isChanged = Object.keys(field).some(
      (key) => field[key] !== filter[key]
    );

    if (field.minPrice > field.maxPrice) {
      return;
    }

    if (isChanged) {
      dispatch(applyFilter(field));
    } else {
      closeModal();
    }
  };

  const onResetFilter = () => {
    const filterFields = ["keyword", "minPrice", "maxPrice", "sortBy"];

    if (filterFields.some((key) => !!filter[key])) {
      dispatch(resetFilter());
    } else {
      closeModal();
    }
  };

  const keywords = useMemo(() => {
    console.log(products);
    const kwSet = new Set();

    products.forEach((product) => {
      const keywords = product.keywords;

      keywords?.forEach((keyword) => {
        kwSet.add(keyword);
      });
    });
    console.log(kwSet);
    return [...kwSet];
  }, [products]);

  return (
    <div className="filters">
      <div className="filters-field">
        <span>Keyword</span>
        <br />
        <br />
        {products.length === 0 && isLoading && !keywords ? (
          <h5 className="text-subtle">Loading Filter</h5>
        ) : (
          <select
            className="filters-brand"
            value={field.keyword}
            disabled={isLoading || products.length === 0}
            onChange={onKeywordFilterChange}
          >
            <option value={null}>--</option>;
            {keywords?.map?.((keyword) => {
              return <option value={keyword}>{keyword}</option>;
            })}
            {/* <option value="">All Brands</option>
            <option value="salt">Salt Maalat</option>
            <option value="betsin">Betsin Maalat</option>
            <option value="black">Black Kibal</option>
            <option value="sexbomb">Sexbomb</option> */}
          </select>
        )}
      </div>
      <div className="filters-field">
        <span>Sort By</span>
        <br />
        <br />
        <select
          className="filters-sort-by d-block"
          value={field.sortBy}
          disabled={isLoading || products.length === 0}
          onChange={onSortFilterChange}
        >
          <option value="">None</option>
          <option value="name-asc">Name Ascending A - Z</option>
          <option value="name-desc">Name Descending Z - A</option>
          <option value="price-desc">Price High - Low</option>
          <option value="price-asc">Price Low - High</option>
        </select>
      </div>
      <div className="filters-field">
        <span>Price Range</span>
        <br />
        <br />
        {(products.length === 0 && isLoading) || max === 0 ? (
          <h5 className="text-subtle">Loading Filter</h5>
        ) : products.length === 1 ? (
          <h5 className="text-subtle">No Price Range</h5>
        ) : (
          <PriceRange
            min={min}
            max={max}
            initMin={field.minPrice}
            initMax={field.maxPrice}
            isLoading={isLoading}
            onPriceChange={onPriceChange}
            productsCount={products.length}
          />
        )}
      </div>
      <div className="filters-action">
        <button
          className="filters-button button button-small"
          disabled={isLoading || products.length === 0}
          onClick={onApplyFilter}
          type="button"
        >
          Apply filters
        </button>
        <button
          className="filters-button button button-border button-small"
          disabled={isLoading || products.length === 0}
          onClick={onResetFilter}
          type="button"
        >
          Reset filters
        </button>
      </div>
    </div>
  );
};

Filters.propTypes = {
  closeModal: PropType.func.isRequired,
};

export default withRouter(Filters);

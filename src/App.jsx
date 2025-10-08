/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState, useMemo } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const categoryMap = Object.fromEntries(
  categoriesFromServer.map(cat => [cat.id, cat]),
);
const userMap = Object.fromEntries(
  usersFromServer.map(user => [user.id, user]),
);

const joinedProducts = productsFromServer.map(product => {
  const category = categoryMap[product.categoryId];
  const owner = category ? userMap[category.ownerId] : null;

  return {
    ...product,
    categoryDetails: category,
    ownerDetails: owner,
  };
});

export const App = () => {
  const [selectedOwnerId, setSelectedOwnerId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [sortingColumn, setSortingColumn] = useState(null);
  const [sortingOrder, setSortingOrder] = useState('asc');

  const handleOwnerSelect = (id, event) => {
    event.preventDefault();
    setSelectedOwnerId(id);
  };

  const handleCategorySelect = (id, event) => {
    event.preventDefault();
    setSelectedCategoryIds(currentIds =>
      currentIds.includes(id)
        ? currentIds.filter(categoryId => categoryId !== id)
        : [...currentIds, id],
    );
  };

  const handleSearchChange = event => setSearchQuery(event.target.value);

  const handleSearchClear = event => {
    event.preventDefault();
    setSearchQuery('');
  };

  const handleSorting = newColumn => {
    if (sortingColumn !== newColumn) {
      setSortingColumn(newColumn);
      setSortingOrder('asc');
    } else if (sortingOrder === 'asc') {
      setSortingOrder('desc');
    } else {
      setSortingColumn(null);
      setSortingOrder('asc');
    }
  };

  const handleResetAllFilters = event => {
    event.preventDefault();
    setSelectedOwnerId(null);
    setSearchQuery('');
    setSelectedCategoryIds([]);
    setSortingColumn(null);
    setSortingOrder('asc');
  };

  const filteredProducts = useMemo(() => {
    let currentProducts = Array.isArray(joinedProducts)
      ? [...joinedProducts]
      : [];

    if (selectedOwnerId !== null) {
      currentProducts = currentProducts.filter(
        p => p.ownerDetails && p.ownerDetails.id === selectedOwnerId,
      );
    }

    if (searchQuery.trim() !== '') {
      const queryLower = searchQuery.trim().toLowerCase();

      currentProducts = currentProducts.filter(p =>
        p.name.toLowerCase().includes(queryLower),
      );
    }

    if (selectedCategoryIds.length > 0) {
      currentProducts = currentProducts.filter(
        p =>
          p.categoryDetails &&
          selectedCategoryIds.includes(p.categoryDetails.id),
      );
    }

    if (sortingColumn) {
      currentProducts.sort((p1, p2) => {
        let val1;
        let val2;

        if (sortingColumn === 'name') {
          val1 = p1.name;
          val2 = p2.name;
        } else if (sortingColumn === 'categoryDetails.title') {
          val1 = p1.categoryDetails ? p1.categoryDetails.title : '';
          val2 = p2.categoryDetails ? p2.categoryDetails.title : '';
        } else {
          return 0;
        }

        const comparison = val1.localeCompare(val2);

        return sortingOrder === 'asc' ? comparison : -comparison;
      });
    }

    return currentProducts;
  }, [
    selectedOwnerId,
    searchQuery,
    selectedCategoryIds,
    sortingColumn,
    sortingOrder,
  ]);

  const getOwnerColorClass = sex =>
    sex === 'm' ? 'has-text-link' : 'has-text-danger';

  const renderSortIcon = columnKey => {
    if (sortingColumn === columnKey) {
      return sortingOrder === 'asc' ? ' ⬆️' : ' ⬇️';
    }

    return '';
  };

  const productRows = filteredProducts.map(product => {
    const { id, name, categoryDetails, ownerDetails } = product;

    if (!categoryDetails || !ownerDetails) {
      return null;
    }

    const ownerClassName = getOwnerColorClass(ownerDetails.sex);
    const categoryDisplay = `${categoryDetails.icon} - ${categoryDetails.title}`;

    return (
      <tr data-cy="Product" key={id}>
        <td className="has-text-weight-bold" data-cy="ProductId">
          {id}
        </td>
        <td data-cy="ProductName">{name}</td>
        <td data-cy="ProductCategory">{categoryDisplay}</td>
        <td data-cy="ProductUser" className={ownerClassName}>
          {ownerDetails.name}
        </td>
      </tr>
    );
  });

  const productCount = filteredProducts.length;

  return (
    <div className="section">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css"
      />
      <script src="https://use.fontawesome.com/releases/v5.3.1/js/all.js" />

      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={selectedOwnerId === null ? 'is-active' : ''}
                onClick={e => handleOwnerSelect(null, e)}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedOwnerId === user.id ? 'is-active' : ''}
                  onClick={e => handleOwnerSelect(user.id, e)}
                >
                  {user.name} ({user.sex})
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search by Product Name"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {searchQuery.length > 0 && (
                  <a
                    href="#/"
                    className="icon is-right"
                    onClick={handleSearchClear}
                  >
                    <i className="fas fa-times" aria-hidden="true" />
                  </a>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button is-success mr-6 ${
                  selectedCategoryIds.length === 0 ? '' : 'is-outlined'
                }`}
                onClick={e => {
                  e.preventDefault();
                  setSelectedCategoryIds([]);
                }}
              >
                All Categories
              </a>
              {categoriesFromServer.map(cat => (
                <a
                  key={cat.id}
                  data-cy="Category"
                  href="#/"
                  className={`button mr-2 my-1 ${
                    selectedCategoryIds.includes(cat.id)
                      ? 'is-link'
                      : 'is-outlined'
                  }`}
                  onClick={e => handleCategorySelect(cat.id, e)}
                >
                  {cat.icon} {cat.title}
                </a>
              ))}
            </div>
            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetAllFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {productCount === 0 ? (
            <p
              data-cy="NoMatchingMessage"
              className="has-text-centered has-text-grey-light p-5"
            >
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">ID</span>
                  </th>
                  <th
                    onClick={() => handleSorting('name')}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product{renderSortIcon('name')}
                    </span>
                  </th>
                  <th
                    onClick={() => handleSorting('categoryDetails.title')}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category{renderSortIcon('categoryDetails.title')}
                    </span>
                  </th>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">User</span>
                  </th>
                </tr>
              </thead>
              <tbody>{productRows}</tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

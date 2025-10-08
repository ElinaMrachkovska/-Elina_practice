/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
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

const products = productsFromServer.map(product => {
  const category = categoryMap[product.categoryId];
  const owner = category ? userMap[category.ownerId] : null;

  return {
    ...product,
    categoryDetails: category,
    ownerDetails: owner,
  };
});

export const App = () => {
  const getOwnerColorClass = sex => {
    return sex === 'm' ? 'has-text-link' : 'has-text-danger';
  };

  const productRows = products.map(product => {
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
              <a data-cy="FilterAllUsers" href="#/" className="is-active">
                All
              </a>

              {usersFromServer.map(user => (
                <a key={user.id} data-cy="FilterUser" href="#/">
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
                  placeholder="Search"
                  value=""
                  readOnly
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>
              {categoriesFromServer.map(cat => (
                <a
                  key={cat.id}
                  data-cy="Category"
                  className="button mr-2 my-1"
                  href="#/"
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
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {products.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {products.length > 0 && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">ID</span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">Product</span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
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

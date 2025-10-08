# React Product Categories Practice

> Here is [the working version](https://mate-academy.github.io/react_product-categories-practice/)

You are given a markup for a table of products and 3 arrays. 
Implement as many options below as you can:

1. Render products in a table with id, name, category, and owner (user).
    - category should render its icon before the title;
    - owner names should be colored with `has-text-link` for men and `has-text-danger` for women.
1. Implement the ability to filter products by owner:
    - If a user is selected it should be highlighted with the `is-active` class;
    - Show only products of a selected user;
    - Select `All` to see all the products.
1. Use the `input` to filter products by name.
    - Show only products having the input value in their name ignoring the case;
    - The `x` button should appear only when the value is not empty;
    - Clear the value after the `x` button click.
1. Show a `No results` message if there are no products matching the current criteria
    - `Reset All Filters` button should clear all the filters.
1. (*) Allow to select several categories:
    - Add `is-info` class to selected categories;
    - Show only products of selected categories;
    - `All` button should clear the selection;
    - Remove the `is-outlined` class from the `All` button if no categories are selected.
1. (*) Add the ability to sort products by all the columns:
    - a column should have a title with the `fa-sort` icon by default;
    - the first click sorts products by the given column ascending and use the `fa-sort-up` icon;
    - the second click sorts products in descending order and uses the `fa-sort-down` icon;
    - the third click disables sorting;
    - products are sorted by 1 column at a time (reset the column title when clicking on the other one)

## Instructions
- Fork, clone, and run `npm i`
- fix the DEMO LINK below (use your GitHub username and the repo name)
  - [DEMO LINK](https://ElinaMrachkovska.github.io/-Elina_practice)
- implement tasks one by one (You can do it in the `App.jsx`)
- `commit`, `push`, and `deploy` after each task
- Send a link to your `App.jsx` file to your personal Slack channel (for example #fe_apr22_misha_hrynko)
- Send a message about solving the next step after each `push` and `deploy` (e.g. Task 3 is done)
- If you are done with the required tasks please proceed with solving the optional once
- Stop when the time is over (typically 2.5 hours from the start)

## Deploy
- To deploy the project, change the second line of code in package.json, specifically the homepage value, from "." to the repository name



/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import './App.scss';
import clsx from 'clsx';

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


//*..............

import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bulma/css/bulma.css';
import './App.scss';
import clsx from 'clsx';

import peopleFromServer from './people.json';

const SORTABLE_COLUMNS = ['name', 'sex', 'born'];
 
const SEX_FILTER = {
 all: null,
 m: 'm',
f: 'f',
}

const getFilteredPeople = (people, {sex, search, sorting}) => {
  let filteredPeople = [...people];

    if (sex) {
      filteredPeople = filteredPeople.filter(person => person.sex === sex);
    }

const normalizedSearch = search.trim().toLowerCase();

if (normalizedSearch) {
  filteredPeople = filteredPeople.filter(person => {
    return person.name.toLowerCase().includes(normalizedSearch);
})
}

if (sorting.column) {
  filteredPeople.sort((person1, person2) => {
    switch(sorting.column) {
      case 'name': {
        return person1.name.localeCompare(person2.name);
      }
      case 'sex': {
        return person1.sex.localeCompare(person2.sex);
      }
      case 'born': {
        return person1.born - person2.born;
      }
      default: {
        throw new Error('Unknown  value');
      }
    }
  });
}

if(sorting.order === 'desc') {
filteredPeople.reverse();
}
return filteredPeople;
}

export const App = () => {
 const [people, setPeople] = useState(peopleFromServer);
 const [selectedPeople, setSelectedPeople] = useState([]);
 const [selectedSex, setSelectedSex] = useState(null);
 const [search, setSearch] = useState('');

 const [sortingColumn, setSortingColumn] = useState(null);
 const [sortingOrder, setSortingOrder] = useState('asc');

 const handleAddPerson = newPerson => {
  setPeople(currentPeople => [newPerson, ...currentPeople]);
 }
  const handleSelectedPerson = person => {
    setSelectedPeople(currentSelectedPeople => {
      return [...currentSelectedPeople, person];
    })
  }

  const handleUnSelectedPerson = (personSlug) => {
    setSelectedPeople(currentSelectedPeople => 
      currentSelectedPeople.filter(person => person.slug !== personSlug)
    )
  }

  const handleSorting = newColumn => {
    if (sortingColumn !== newColumn) {
      setSortingColumn(newColumn);
      setSortingOrder('asc');
    } else if (sortingOrder === 'desc') {
       setSortingOrder('desc');
    } else {
      setSortingColumn(null);
      setSortingOrder('asc');
    }
  } 

  const handleResetFilter = () => {
    setSelectedSex(null);
    setSearch('');
  }

  const isSelected = personSlug =>
    selectedPeople.some(person => person.slug === personSlug);

  const filteredPeople = getFilteredPeople(people, {
    sex: selectedSex,
    search,
    sorting: {
      column: sortingColumn,
      order: sortingOrder,
    }
  });

    return (
      <div className="box">
        <h1 className="title">People table</h1>

        <div className="block">
        <div className="buttons has-addons">
        {Object.entries(SEX_FILTER).map(([text, value]) => (
          <button
          key={value}
          type ='button'
          className={clsx('button', {
            'is-info' : selectedSex === value,
          })}
          onClick={() => {
            setSelectedSex(value);
          }}
          >
            {text}
          </button>
        ))}
        </div> 
         
        <input 
        type='search'
        value={search}
        onChange={event => setSearch(
          event.target.value.trimStart())}
        />
      </div>
      
      <div className="mb-4">
      <button
      type="button"
      className="button"
      onClick={handleResetFilter}
      >
      Reset all filters
      </button>
      </div>

      <button
      type="button"
      className="button"
      onClick={() => handleAddPerson({
      name: 'New Person',
      sex: 'm',
      born: 2000,
      slug: `person-${Date.now()}`
    })}

      >
     + Add new person
      </button>
      <table className="table is-striped is-narrow">
<caption className='title is-5 has text-info'>
{selectedPeople.map(person => person.name).join(', ')}
</caption>
      <thead>
      <tr>
      {SORTABLE_COLUMNS.map(column => (
<th key={column} 
onClick={() => handleSorting(column)}>
  {column}
  {sortingColumn === column && sortingOrder === 'asc' && '⬆️' }
  {sortingColumn === column && sortingOrder === 'desc' && '⬇️'}
  </th>
  ))}
  <th> Actions</th>
  </tr>
</thead>

          <tbody>
          {filteredPeople.map(person => {
            return (
              <tr 
              key={person.slug}
              className={clsx({
                'has-background-warning'
                : isSelected(person.slug),
              })}
           >
              <td
              className={clsx('has-text-light', {
                'has-text-danger': person.sex === 'f',
                'has-text-link' : person.sex === 'm',
              })}
              >
              {person.name}
              </td>

              <td>{person.sex}</td>
              <td>{person.born}</td>
              <td>
              {isSelected(person.slug) ? (
                <button
                type='button'
                onClick={() => handleUnSelectedPerson(person.slug)}
                className='is-small is-rounded is-danger'
                >
                <span className='icon is-small'>
                <i className='fas fa-minus' />
                </span>
                </button>
              ) : (
                <button
                type='button'
                onClick={() => handleSelectedPerson(person)}
                className='is-small is-rounded is-success'
                >
                 <span className='icon is-small'>
                <i className='fas fa-plus' />
                </span>
                </button>
              )}
              </td>
            </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    );
  }


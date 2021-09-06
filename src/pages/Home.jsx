import React from 'react';

import Card from '../components/Card';

function Home({ 
    items, 
    searchValue,
    setSearchValue,
    onChangeSearchInput,
    onAddToFavorite,
    onAddToCart, 
    isLoading,
  }) {

    const renderItems = () => {
      const filtredItems = items.filter((item) =>
        item.title.toLowerCase().includes(searchValue.toLowerCase()),
      );
      return (isLoading ? [...Array(12)] : filtredItems).map((item, index) => (
        <Card
          key={index}
          onFavorite={(obj) => onAddToFavorite(obj)}
          onPlus={(obj) => onAddToCart(obj)}
          loading={isLoading}
          {...item}
        />
      ));
    };
  
    return (
      <div className="content p-40">
        <div className="d-flex align-center justify-between mb-40">
          <h1>{searchValue ? `Поиск по запросу: "${searchValue}"` : 'Все машины'}</h1>
          <div className="search-block d-flex">
            <img src="img/search.svg" alt="Search" />
            {searchValue && (
              <img
                onClick={() => setSearchValue('')}
                className="clear cu-p"
                src="img/btn-remove.svg"
                alt="Clear"
              />
            )}
            <input onChange={onChangeSearchInput} value={searchValue} placeholder="Поиск..." />
          </div>
        </div>
        <div className="d-flex flex-wrap">{renderItems()}</div>
      </div>
    );
  }
//     return (
//         <div className="content p-40">
//             <div className="d-flex align-center mb-40 justify-between">
//                 <h1>{searchValue ? `Поиск по запросу: "${searchValue}"` : 'Все кросовки'}</h1>
//                 <div className="search-block d-flex">
//                     <img src="/img/search.svg" alt="Search" />
//                     {searchValue && <img onClick={() => setSearchValue('')} className="clear cu-p" src="/img/btn-remove.svg" alt="Clear" />}
//                     <input onChange={onChangeSearchInput} value={searchValue} placeholder="Поиск..." type="text" />
//                 </div>
//             </div>

//             <div className="d-flex flex-wrap">
//                 {/* arr.map((obj) */}
//                 {items
//                     .filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()))
//                     .map((item, index) => (
//                         <Card
//                             key={index}
//                             onFavorite={(obj) => onAddToFavorite(obj)}
//                             onPlus={(obj) => onAddToCart(obj)}
//                             added={cartItems.some((obj) => Number(obj.id) === Number(item.id))}
//                             loading={false}
//                             {...item}
//                         />
//                     ))}
//             </div>
//         </div>
//     );
// }

export default Home;
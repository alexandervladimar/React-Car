import React from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';

import Header from './components/Header';
import Drawer from './components/Drawer';
import AppContext from './context';

import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';


// const arr = [
//     { "title": "Lexus Spot", "price": 12680, "imageUrl": "/img/cars/1.jpg" },
//     { "title": "Bugatti divo", "price": 17860, "imageUrl": "/img/cars/2.jpg" },
//     { "title": "Mclaren 675lt", "price": 13850, "imageUrl": "/img/cars/3.jpg" },
//     { "title": "Maserati Hibrido", "price": 19020, "imageUrl": "/img/cars/4.jpg" },
//     { "title": "Ferrari Mansory", "price": 18200, "imageUrl": "/img/cars/5.jpg" },
//     { "title": "Lotus Evija", "price": 12500, "imageUrl": "/img/cars/6.jpg" },
//     { "title": "Chevrolet El-tron", "price": 18800, "imageUrl": "/img/cars/7.jpg" },
//     { "title": "Audi Ser-2036", "price": 25260, "imageUrl": "/img/cars/8.jpg" },
//     { "title": "Bentley Continental GT", "price": 13200, "imageUrl": "/img/cars/9.jpg" },
//     { "title": "Mercedes V8 Biturbo", "price": 14550, "imageUrl": "/img/cars/10.jpg" },
//     { "title": "Lamborghini EVO", "price": 16540, "imageUrl": "/img/cars/11.jpg" },
//     { "title": "Mansory Stallone GTS", "price": 13200, "imageUrl": "/img/cars/12.jpg" },
// ]

function App() {
    const [items, setItems] = React.useState([]);
    const [cartItems, setCartItems] = React.useState([]);
    const [favorites, setFavorites] = React.useState([]);
    const [searchValue, setSearchValue] = React.useState('');
    const [cartOpened, setCartOpened] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        // fetch('https://610aba2252d56400176aff60.mockapi.io/items').then(res => {
        // return res.json();
        // }).then((json) => {
        //     setItems(json);
        // });

       async function fetchData() {
        try {
          const [cartResponse, favoritesResponse, itemsResponse] = await Promise.all([
            axios.get('https://610aba2252d56400176aff60.mockapi.io/cart'),
            axios.get('https://610aba2252d56400176aff60.mockapi.io/favorites'),
            axios.get('https://610aba2252d56400176aff60.mockapi.io/items'),
          ]);
  
          setIsLoading(false);
          setCartItems(cartResponse.data);
          setFavorites(favoritesResponse.data);
          setItems(itemsResponse.data);
        } catch (error) {
          alert('Ошибка при запросе данных ;');
          console.error(error);
        }
      }
      //   const cartRespons = await axios.get('https://610aba2252d56400176aff60.mockapi.io/cart');
      //   const favoritesRespons = await axios.get('https://610aba2252d56400176aff60.mockapi.io/favorites');
      //   const itemsRespons = await axios.get('https://610aba2252d56400176aff60.mockapi.io/items');
      //   setIsLoading(false);
      //   setItems(itemsRespons.data);
      //   setCartItems(cartRespons.data);
      //   setFavorites(favoritesRespons.data);
      //  }

       fetchData();
    }, []);

    
    const onAddToCart = async (obj) => {
      try {
        const findItem = cartItems.find((item) => Number(item.parentId) === Number(obj.id));
        if (findItem) {
          setCartItems((prev) => prev.filter((item) => Number(item.parentId) !== Number(obj.id)));
          await axios.delete(`https://610aba2252d56400176aff60.mockapi.io/cart/${findItem.id}`);
        } else {
          setCartItems((prev) => [...prev, obj]);
          const { data } = await axios.post('https://610aba2252d56400176aff60.mockapi.io/cart', obj);
          setCartItems((prev) =>
            prev.map((item) => {
              if (item.parentId === data.parentId) {
                return {
                  ...item,
                  id: data.id,
                };
              }
              return item;
            }),
          );
        }
      } catch (error) {
        alert('Ошибка при добавлении в корзину');
        console.error(error);
      }
    };

    const onRemoveItem = (id) => {
      try {
        axios.delete(`https://610aba2252d56400176aff60.mockapi.io/cart/${id}`);
        setCartItems((prev) => prev.filter((item) => Number(item.id) !== Number(id)));
      } catch (error) {
        alert('Ошибка при удалении из корзины');
        console.error(error);
      }
    };

    const onAddToFavorite = async (obj) => {
        try {
            if (favorites.find((favObj) => Number(favObj.id) === Number(obj.id))) {
                axios.delete(`https://610aba2252d56400176aff60.mockapi.io/favorites/${obj.id}`);
                setFavorites((prev) => prev.filter((item) => Number(item.id) !== Number(obj.id)));
            } else {
                const { data } = await axios.post('https://610aba2252d56400176aff60.mockapi.io/favorites', obj);
                setFavorites((prev) => [...prev, data]);
            }
        } catch (error) {
            alert('Не удалось добавить в закладки')
            console.error(error);
        }
    };

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    };

    const isItemAdded = (id) => {
      return cartItems.some((obj) => Number(obj.parentId) === Number(id));
    };

    return (
      <AppContext.Provider 
      value={{ 
        items, 
        cartItems, 
        favorites, 
        isItemAdded,
        onAddToFavorite, 
        onAddToCart,
        setCartOpened,
        setCartItems,
        }}>
        <div className="wrapper clear">
         <Drawer
            items={cartItems}
            onClose={() => setCartOpened(false)}
            onRemove={onRemoveItem}
            opened={cartOpened}
        />

        <Header onClickCart={() => setCartOpened(true)} />

         <Route path="/" exact>
            <Home
                items={items}
                cartItems={cartItems}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToFavorite={onAddToFavorite}
                onAddToCart={onAddToCart}
                isLoading={isLoading}
            />
          </Route>

          <Route path="/favorites" exact>
            <Favorites />
         </Route>

         <Route path="/orders" exact>
          <Orders />
         </Route>
        </div>
      </AppContext.Provider>
    );
}

export default App;
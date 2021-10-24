import { useEffect, useState } from 'react';
import { api } from '../../utils/Api';
import Table from '../Table/Table';
import { Loader, Title } from './Quotes.styles';
import PopupWithInfo from '../PopupWithInfo/PopupWithInfo';


function TabB({ isPopupOpen, setIsPopupOpen, isPopupErrorOpen, setIsPopupErrorOpen, setErrorText }) {
  const [prices, setPrices] = useState({});
  const [info, setInfo] = useState({});
  const [firstTab, setFirstTab] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  function apiMethodOne() {
    api
      .getData()
      .then((res) => {
        setPrices(res);
        setIsLoading(false);
        console.log('один');
        setIsPopupErrorOpen(false);
      })
      .catch((rej) => {
        console.log(rej);
        setErrorText('Произошла ошибка при загрузке данных');
        setIsPopupErrorOpen(true);
        console.log('два', isPopupErrorOpen);
      })
  }

  useEffect(() => {
    const names = Object.keys(prices);
    const regex = /^USDT/;
    const tabOne = [];
    names.forEach((name) => {
      if (regex.test(name)) {
        tabOne.push(name);
      }
    });
    setFirstTab(tabOne);
    console.log('1', tabOne);
  }, [prices])

  useEffect(() => {
    apiMethodOne();
  }, []);

  useEffect(() => {
    const interval = setInterval(function () {
      if (!isPopupOpen) {
        apiMethodOne();
      }
    }, 5000);
    return function clear() {
      clearInterval(interval);
    };
  }, [isPopupOpen]);

  const handleRowClick = (name) => (evt) => {
    setIsPopupOpen(true);
    const data = {
      name,
      last: prices[name].last,
      highestBid: prices[name].highestBid,
      percentChange: prices[name].percentChange
    }
    setInfo(data);
  }

  function handleClosePopup() {
    setIsPopupOpen(false);
  }


  return (
    <>
      {isPopupOpen && <PopupWithInfo info={info} onClose={handleClosePopup} />}
      {isLoading ? <Loader /> : (
        <>
          <Title>Курс USDT</Title>
          <Table prices={prices} dataNames={firstTab} onRowClick={handleRowClick} />
        </>
      )}
    </>
  )
}

export default TabB;
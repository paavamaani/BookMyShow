import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { auth } from '../utils/firebase';
import axios from '../utils/axios';

import Form from './Form';
import ShowMessage from './ShowMessage';

const MovieBooking = (props) => {
  const user = useSelector((store) => store.user);
  const [message, setMessage] = useState({});

  const numRows = Math.round(props.movie.seating_capacity / 10);
  const seatsPerRow = Math.round(props.movie.seating_capacity / 10);

  const initialSeatData = Array.from({ length: numRows - 1 }, () =>
    Array(seatsPerRow - 1).fill('')
  );

  const [seatData, setSeatData] = useState(initialSeatData);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  const toggleSeat = (rowIndex, colIndex) => {
    const newSeatData = [...seatData];
    const isSelected = newSeatData[rowIndex][colIndex] === props.userId;

    if (isSelected) {
      newSeatData[rowIndex][colIndex] = ''; // Deselect the seat
      setSelectedSeats(
        selectedSeats.filter(
          (seat) => seat.row !== rowIndex || seat.col !== colIndex
        )
      );
    } else {
      if (selectedSeats.length < 8) {
        newSeatData[rowIndex][colIndex] = props.userId;
        setSelectedSeats([...selectedSeats, { row: rowIndex, col: colIndex }]);
      } else {
        alert('You can only book up to 8 seats at once.');
      }
    }

    setSeatData(newSeatData);
  };

  const showMessage = () => {
    setTimeout(() => {
      setMessage(false);
    }, 3000);
  };

  const handleBooking = (ev) => {
    ev.preventDefault();

    const selectedSeatObjects = selectedSeats.map((seat) => {
      const rowLetter = String.fromCharCode(65 + seat.row); // Convert row index to letter
      const colNumber = seat.col + 1; // Increment column index by 1

      return `${rowLetter}${colNumber}`;
    });

    // Form the booking object with the updated properties
    const bookingInfo = {
      userId: auth.currentUser.uid,
      seat: selectedSeatObjects.join(','),
      title: props.movie.title,
      language: props.movie.language,
      theater: props.movie.theater,
      location: props.movie.location,
      start_time: props.movie.start_time,
      end_time: props.movie.end_time,
      screen: props.movie.screen,
      isRefunded: false,
    };

    console.log(bookingInfo);
    setBookedSeats([...bookedSeats, bookingInfo]);

    axios
      .post('/booking', bookingInfo)
      .then((response) => {
        setMessage({
          className: 'border border-green-500 bg-green-100',
          message: response.data.message,
        });

        showMessage();
      })
      .catch((error) => {
        setMessage({
          className: 'border border-red-500 bg-red-100',
          message: error.message,
        });
        console.log(error);
      });

    setSelectedSeats([]);
  };

  return (
    <>
      {Object.keys(message).length > 0 && <ShowMessage showMessage={message} />}
      <div className='flex justify-between mx-auto mt-4 p-4'>
        <div className='w-3/6 mr-4'>
          <h2 className='text-md text-center font-semibold m-2'>
            {' '}
            Screen this side{' '}
          </h2>
          {seatData.map((row, rowIndex) => (
            <div key={rowIndex} className='flex justify-around'>
              {row.map((seat, colIndex) => (
                <div
                  key={colIndex}
                  className={`seat m-1 p-2 text-center cursor-pointer ${
                    seat === props.userId
                      ? 'bg-green-300 text-white'
                      : 'bg-gray-300'
                  }`}
                  onClick={() => toggleSeat(rowIndex, colIndex)}
                ></div>
              ))}
            </div>
          ))}
          <div className='booking-summary mt-4'>
            <h2 className='text-2xl font-semibold'>Booking Summary</h2>
            <p>
              <span className='text-sm font-semibold'> Ticket Price: </span> $
              {selectedSeats.length * props.movie.price}
            </p>
            <p>
              <span className='text-sm font-semibold'> Service fee: </span> $
              {user.isPremiumUser ? '0' : '1.5'}
            </p>
            <p>
              <span className='text-sm font-semibold'> Total: </span> $
              {selectedSeats.length * props.movie.price +
                (!user.isPremiumUser && 1.5)}
            </p>
          </div>
        </div>
        <Form
          className='w-3/6'
          id='premiumSubscription'
          onSubmit={handleBooking}
        >
          <div className='my-2'>
            <label className='block mb-1 text-sm font-semibold'>Amount</label>
            <input
              required='required'
              maxlength='16'
              className='p-2 mb-2 border border-1 w-full'
              disabled='disabled'
              placeholder='Enter card number'
              type='number'
              value='15'
            />
          </div>
          <div className='my-2'>
            <label className='block mb-1 text-sm font-semibold'>
              Card Number
            </label>
            <input
              required='required'
              minlength='16'
              maxlength='16'
              className='p-2 mb-2 border border-1 w-full'
              placeholder='Enter card number'
              type='text'
            />
          </div>
          <div className='my-2'>
            <label className='block mb-1 text-sm font-semibold'>
              Expiry date
            </label>
            <input
              required='required'
              minlength='5'
              maxlength='5'
              className='p-2 mb-2 border border-1 w-full'
              placeholder='Enter expiry date MM/YY'
              type='text'
            />
          </div>
          <div className='my-2'>
            <label className='block mb-1 text-sm font-semibold'>CVV</label>
            <input
              minlength='3'
              maxlength='3'
              className='p-2 mb-2 border border-1 w-full'
              placeholder='Enter CVV'
              type='text'
            />
          </div>
          <button
            className='p-2 bg-black text-slate-50 hover:bg-slate-700'
            type='submit'
            disabled={selectedSeats.length === 0}
          >
            {' '}
            Make Payment{' '}
          </button>
        </Form>
      </div>
    </>
  );
};

export default MovieBooking;

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function BookingHistory({ user }) {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('Loading booking history...');

  useEffect(() => {
    if (user) {
      fetchBookingHistory();
    }
  }, [user]);

  async function fetchBookingHistory() {
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false });

    if (bookingsError) {
      setMessage('Error loading bookings: ' + bookingsError.message);
      return;
    }

    const { data: roomsData, error: roomsError } = await supabase
      .from('rooms')
      .select('*');

    if (roomsError) {
      setMessage('Error loading rooms: ' + roomsError.message);
      return;
    }

    const bookingsWithRoomNames = (bookingsData || []).map((booking) => {
      const room = roomsData.find((room) => room.id === booking.room_id);

      return {
        ...booking,
        room_name: room ? room.name : 'Unknown Room',
      };
    });

    setBookings(bookingsWithRoomNames);
    setMessage('');
  }

  async function handleCancelBooking(bookingId) {
    const confirmed = window.confirm('Are you sure you want to cancel this booking?');

    if (!confirmed) return;

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (error) {
      setMessage('Error cancelling booking: ' + error.message);
      return;
    }

    setMessage('Booking cancelled successfully.');
    fetchBookingHistory();
  }

  if (!user) {
    return (
      <div className="simple-page">
        <h1>Booking History</h1>
        <div className="message-box">You must log in first.</div>
      </div>
    );
  }

  return (
    <div className="simple-page">
      <h1>Booking History</h1>

      {message && <div className="message-box">{message}</div>}

      {bookings.length === 0 ? (
        <p className="empty-text">No bookings found.</p>
      ) : (
        <div className="list-stack">
          {bookings.map((booking) => (
            <div key={booking.id} className="history-card">
              <div className="history-header">
                {booking.room_name}
              </div>

              <div className="history-body">
                <p><strong>Check-in:</strong> {booking.check_in_date}</p>
                <p><strong>Check-out:</strong> {booking.check_out_date}</p>
                <p><strong>Status:</strong> {booking.status}</p>

                {booking.status !== 'cancelled' && (
                  <button
                    className="danger-btn"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingHistory;
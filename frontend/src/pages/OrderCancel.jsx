const OrderCancel = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-900'>
      <div className='bg-gray-800 text-white p-8 rounded-lg shadow-lg'>
        <h1 className='text-2xl font-bold mb-4'>Order Cancelled</h1>
        <p className='text-gray-300'>Your order has been successfully cancelled.</p>
        <button
          onClick={() => navigate('/')}
          className='mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md'
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default OrderCancel;

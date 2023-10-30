// This is the component that sits at the top of the page to send the user to the beta site with log in function
const Redirect = () => {
  return (
    <div className="flex flex-col justify-center gap-1 bg-zinc-900 py-2 text-center font-mono text-base sm:block sm:space-x-2 sm:py-3 sm:text-lg">
      <p>Note: It might some time (about a minute) for the transactions to process. If you don't see your NFT, Please Wait a minute and refresh the page</p>
    </div>
  );
};

export default Redirect;

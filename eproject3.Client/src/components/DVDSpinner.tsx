const DVDSpinner = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-32 h-32 rounded-full border-[6px] border-t-transparent border-r-white border-b-gray-300 border-l-white animate-spin shadow-lg relative">
                {/* DVD center hole */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-black shadow-inner" />
                </div>
            </div>
        </div>
    );
};

export default DVDSpinner;

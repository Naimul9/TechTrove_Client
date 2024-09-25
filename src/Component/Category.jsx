

const Category = () => {
   

    return (
        <div className="mt-10 mb-20">
            <h1 className="font-bold text-4xl">Shop By Category</h1>
            <div className="grid mt-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* 1 */}
            <div className="bg-base-100 shadow-xl rounded-2xl cursor-pointer">
                    <figure className="px-10 pt-10">
                        <img
                            src='https://admin.dazzle.com.bd/assets/accounts/a_8037/prod_29_001.jpg'
                            alt='Mobile'
                            loading="lazy"
                            className="rounded-xl w-full"
                        />
                    </figure>
                    <p className="font-bold text-center text-xl pb-10">SMARTPHONE</p>
                </div>
               

                {/* 2 */}
                <div className="bg-base-100 shadow-xl rounded-2xl cursor-pointer" >
                    <figure className="px-10 pt-10">
                        <img
                            src='https://admin.dazzle.com.bd/assets/accounts/a_8037/prod_297_538.jpg'
                            alt='Laptop'
                            loading="lazy"
                            className="rounded-xl w-full"
                        />
                    </figure>
                    <p className="font-bold text-center text-xl pb-10">LAPTOP</p>
                </div>

                {/* 3 */}
                <div className="bg-base-100 shadow-xl rounded-2xl cursor-pointer" >
                    <figure className="px-10 pt-10">
                        <img
                            src='https://admin.dazzle.com.bd/assets/accounts/a_8037/prod_1_991.jpg'
                            alt='Earphones'
                            loading="lazy"
                            className="rounded-xl w-full"
                        />
                    </figure>
                    <p className="font-bold text-center text-xl pb-10">EARPHONES</p>
                </div>

                {/* 4 */}
                <div className="bg-base-100 shadow-xl rounded-2xl cursor-pointer">
                    <figure className="px-10 pt-10">
                        <img
                            src='https://admin.dazzle.com.bd/assets/accounts/a_8037/prod_426_557.jpg'
                            alt='Soundbox'
                            loading="lazy"
                            className="rounded-xl w-full"
                        />
                    </figure>
                    <p className="font-bold text-center text-xl pb-10">SOUNDBOX</p>
                </div>
            </div>
        </div>
    );
};

export default Category;

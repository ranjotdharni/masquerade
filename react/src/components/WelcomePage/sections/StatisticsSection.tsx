
export default function StatisticsSection() {
    let forbesLink: string = "https://www.forbes.com/sites/blakemorgan/2019/09/24/50-stats-that-prove-the-value-of-customer-experience/"
    let wifiTalentsLink: string = "https://wifitalents.com/data-quality-statistics/"

    return (
        <section className="w-full flex flex-col items-center mt-10 md:mt-28 space-y-12">
            <header className="flex flex-col items-center space-y-2">
                <h4 className="text-[1.75rem] text-secondary font-roboto-bold">Did you know?</h4>
                <h3 className="text-[2rem] md:text-[2.75rem] text-text font-roboto-bold px-4 md:px-0 md:max-w-170 text-center">2 out of 3 companies compete for customer experience [ <a className="text-inactive hover:text-primary" href={forbesLink} target="_blank"><span className="underline font-roboto-italic">Forbes</span></a> ]</h3>
            </header>

            <div className="w-full flex flex-col md:flex-row md:justify-center items-center space-y-10 md:space-y-0 md:space-x-16">
                <figure className="w-[90%] md:w-auto md:h-70 aspect-[14/9] bg-accent rounded-lg text-center py-10 md:px-20 text-text">
                    <p className="text-[1.5rem]/8 font-roboto ">
                        Poor data costs 
                        <br></br> 
                        <span className="text-[3.5rem]/16 font-roboto-bold">$15 Million</span> 
                        <br></br> each year [ <a className="text-inactive hover:text-primary" href={wifiTalentsLink} target="_blank"><span className="underline font-roboto-italic">WifiTalents</span></a> ]
                    </p>
                </figure>

                <figure className="w-[90%] md:w-auto md:h-70 aspect-[14/9] bg-accent rounded-lg text-center py-10 px-20 text-text">
                    <p className="text-[1.5rem]/8 font-roboto ">
                        Most data quality scores 
                        <br></br> 
                        <span className="text-[3.5rem]/16 font-roboto-bold">60 / 100</span> 
                        <br></br> on average across industries [ <a className="text-inactive hover:text-primary" href={wifiTalentsLink} target="_blank"><span className="underline font-roboto-italic">WifiTalents</span></a> ]
                    </p>
                </figure>
            </div>
        </section>
    )
}


export default function ListCommandes({commandes}) {

    if(commandes.length === 0){
        return(
            <div>
                <h1>Vous n'avez pas de commandes</h1>
            </div>
        )
    }

    let BoxCss = "word-break border-2 p-1 border-black dark:border-[#e5e7eb]"
    return (
        <div className="w-full flex jusity-center flex-col items-center">
        <h1 className="text-2xl font-bold ">liste commandes</h1>
        <div className="overflow-auto w-3/4 small:w-5/6">
            <table className="w-full table-auto	">
                <thead className="border-2 border-black dark:border-[#e5e7eb]">
                    <tr className="border-2 dark:border-[#e5e7eb]">
                        <th className={BoxCss}>Nom</th>
                        <th className={BoxCss}>Adresse</th>
                        <th className={BoxCss}>Wilaya</th>
                        <th className={BoxCss}>Prix</th>
                        <th className={BoxCss}>Date</th>
                        <th className={BoxCss}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        commandes.map((commande,index) => {
                            let date = new Date(commande.date);
                            date = date.toLocaleDateString();
                            return(
                                <tr key={index} className="border-2 border-black dark:border-[#e5e7eb]">
                                    <td className={BoxCss}>{commande.clientName}</td>
                                    <td className={BoxCss}>{commande.clientAdresse}</td>
                                    <td className={BoxCss}>{commande.clientWilaya}</td>
                                    <td className={BoxCss}>{commande.totalPrice}</td>
                                    <td className={BoxCss}>{date}</td>
                                    <td className={BoxCss}>{commande.status}</td>
                                </tr>
                            )
                            })
                    }
                </tbody>
            </table>
        </div>
        
        </div>
    )
}
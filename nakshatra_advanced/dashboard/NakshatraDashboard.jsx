// nakshatra_advanced/dashboard/NakshatraDashboard.jsx

import React from "react";

export default function NakshatraDashboard({

    data

}) {

    return (

        <div className="p-4">

            <h1 className="text-2xl font-bold">

                Nakshatra Dashboard

            </h1>

            <div className="grid grid-cols-3 gap-4 mt-4">

                {data.map((item, idx) => (

                    <div
                        key={idx}
                        className="border p-4 rounded"
                    >

                        <h2 className="font-bold">

                            {item.nakshatra}

                        </h2>

                        <p>

                            Score:
                            {item.score}

                        </p>

                    </div>
                ))}

            </div>

        </div>
    );
}

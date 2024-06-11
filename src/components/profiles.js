import React from 'react'

export default function profiles({ Leaderboard }) {
    return (
        <div id="profile">
            {Item(Leaderboard)}
        </div>
    )
}

function Item(data){
    return (
        <>
            <div className="columns">
                <div className="item">
                    <p>Name</p>
                </div>
                <div className="item">
                    <p>Score</p>
                </div>
            </div>

            {
                data.filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.name === value.name && t.score === value.score
                    )))
                    .sort((a, b) => {
                        if ( a.score === b.score){
                            return b.score - a.score;
                        } else {
                            return b.score - a.score;
                        }
                    })
                    .map((value, index) => (
                        <div className="flex" key={index}>
                            <div className="item">
                                <p>{value.name}</p>
                            </div>
                            <div className="item">
                                <p>{value.score}</p>
                            </div>
                        </div>
                    )
                )
            }
        </>
    )
}
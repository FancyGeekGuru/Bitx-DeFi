import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import './index.scss';

import GoldVIPCard from 'assets/img/nft mint/GOLD PIC.png';
import SilverVIPCard from 'assets/img/nft mint/SILVER PIC.png';
import BronzeVIPCard from 'assets/img/nft mint/BRONZE PIC.png';
import NFTHexagon from 'assets/img/nft mint/nft hexagon.svg';

const NFTMint = () => {
    const [mintCardType, setMintCardType] = useState(0); // select golden card by default
    const cardList = ["gold", "silver", "bronze"]; // card list for current selection status text

    function handleCardType(e) {
        setMintCardType(e.target.value);
    }

    return (
        <div className="home-container">
            <Row style={{ marginBottom: "30px", alignItems: "center" }}>

                <Col md="12" lg="6" className="text-center" style={{ paddingLeft: "30px", paddingRight: "30px" }}>
                    <img src={NFTHexagon} style={{ width: "60%", marginTop: "-20px" }} />
                    
                    <p className="description-title" style={{ marginTop: "-10px" }}>{"Mint BTX VIP Pass Cards"}</p>
                    <p className="description-body text-left">
                        {"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu nibh bibendum, dictum nibh eu, ultricies lectus. Nullam metus eros, lacinia quis condimentum at, sagittis eu sapien. Suspendisse suscipit orci nec eros elementum"}
                    </p>

                    <button className="mint-button" style={{ marginTop: "30px" }}>Mint</button>

                    <p style={{ marginTop: "30px", color: "#FEE277" }}>
                        {"You selected " + cardList[mintCardType] + " vip card."}
                    </p>
                </Col>

                <Col md="12" lg="6">
                    <fieldset onChange={(e) => handleCardType(e)}>
                        <input id="gold-radio" type="radio" name="VIPCardRadioGroup" value={0} checked={mintCardType == 0} />
                        <label htmlFor='gold-radio'>
                            <div className="mint-vip-card">
                                <img src={GoldVIPCard} />
                                <div className="balance">
                                    <span>{"Balance: 0250"}</span>
                                </div>
                            </div>
                        </label>

                        <input id="silver-radio" type="radio" name="VIPCardRadioGroup" value={1} />
                        <label htmlFor='silver-radio'>
                            <div className="mint-vip-card">
                                <img src={SilverVIPCard} />
                                <div className="balance">
                                    <span>{"Balance: 0500"}</span>
                                </div>
                            </div>
                        </label>

                        <input id="bronze-radio" type="radio" name="VIPCardRadioGroup" value={2} />
                        <label htmlFor='bronze-radio'>
                            <div className="mint-vip-card">
                                <img src={BronzeVIPCard} />
                                <div className="balance">
                                    <span>{"Balance: 1000"}</span>
                                </div>
                            </div>
                        </label>
                    </fieldset>
                </Col>
            </Row>
        </div>
    );
};

export default NFTMint;
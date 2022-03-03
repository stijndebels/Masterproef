/*
Author: Stijn De Bels
Constants used throughout the thesis.
*/
export const meterNrPixelOmzetting = (500/27);
export const pixelnrMiniatuurPixelOmzetting = (127/500);

export const images = {
    AM08M_a: require('../images/AM08M_a.png'),
    AM08M_b: require('../images/AM08M_b.png'),
    AM08M_c: require('../images/AM08M_c.png'),
    AM08P_a: require('../images/AM08M_a.png'),
    AM08P_b: require('../images/AM08M_b.png'),
    AM08P_c: require('../images/AM08M_c.png')
};

export const imagesSMALL = {
    AM08M_a: require('../images/AM08M_aSMALL.png'),
    AM08M_b: require('../images/AM08M_bSMALL.png'),
    AM08M_c: require('../images/AM08M_cSMALL.png'),
    AM08P_a: require('../images/AM08M_aSMALL.png'),
    AM08P_b: require('../images/AM08M_bSMALL.png'),
    AM08P_c: require('../images/AM08M_cSMALL.png')
};

export const objImages = {
    STAIRS: require('../images/ObjSTAIRS.png'),
    ROOF: require('../images/ObjROOF.png')
};

export const featureImages = {
    lastPlanned_materialUnits_hasBikeSection: require('../images/Pictogram_fiets.png'),
    lastPlanned_materialUnits_hasToilets: require('../images/Pictogram_toilet.png'),
    lastPlanned_materialUnits_hasAirco: require('../images/Pictogram_airco.png'),
    lastPlanned_materialUnits_hasTables: require('../images/Pictogram_tafel.png'),
    lastPlanned_materialUnits_hasSecondClassOutlets: require('../images/Pictogram_stopcontact.png'),
    lastPlanned_materialUnits_hasPrmSection: require('../images/Pictogram_rolstoel.png')
};

export const featureText = {
    lastPlanned_materialUnits_hasBikeSection: "fietsenvoorziening",
    lastPlanned_materialUnits_hasToilets: "toiletvoorziening",
    lastPlanned_materialUnits_hasAirco: "airco",
    lastPlanned_materialUnits_hasPrmSection: "voorziening voor invaliden"
};


export const imagesGeneral = {
    "train-C1": require('../images/train-C1.png'),
    "train-C2": require('../images/train-C2.png'),
    "train-firstC1": require('../images/train-firstC1.png'),
    "train-firstC2": require('../images/train-firstC2.png'),
    "train-lastC2": require('../images/train-lastC2.png'),
    "train-lastC1": require('../images/train-lastC1.png'),
    "train-firstC12": require('../images/train-firstC12.png'),
    "train-firstC21": require('../images/train-firstC21.png'),
    "train-lastC21": require('../images/train-lastC21.png'),
    "train-lastC12": require('../images/train-lastC12.png'),
    "train-lastnone": require('../images/train-lastnone.png'),
    "train-firstnone": require('../images/train-firstnone.png')
};
export const images20 = {
    "train-lastnone": require('../images/train-lastnone-20.png'),
    "train-firstnone": require('../images/train-firstnone-20.png')
};

export const images27 = {
    "train-C1": require('../images/train-C1-27.png'),
    "train-C2": require('../images/train-C2-27.png'),
    "train-firstC1": require('../images/train-firstC1-27.png'),
    "train-firstC2": require('../images/train-firstC2-27.png'),
    "train-lastC2": require('../images/train-lastC2-27.png'),
    "train-lastC1": require('../images/train-lastC1-27.png'),
    "train-firstC12": require('../images/train-firstC12-27.png'),
    "train-firstC21": require('../images/train-firstC21-27.png'),
    "train-lastC21": require('../images/train-lastC21-27.png'),
    "train-lastC12": require('../images/train-lastC12-27.png')
};
export const imageLengths = {
    27000: images27,
    20000: images20,
    general: imagesGeneral
};

export const smallImages27 = {
    "train-C1": require('../images/train-C1-27SMALL.png'),
    "train-C2": require('../images/train-C2-27SMALL.png'),
    "train-firstC1": require('../images/train-firstC1-27SMALL.png'),
    "train-firstC2": require('../images/train-firstC2-27SMALL.png'),
    "train-lastC2": require('../images/train-lastC2-27SMALL.png'),
    "train-lastC1": require('../images/train-lastC1-27SMALL.png'),
    "train-firstC12": require('../images/train-firstC12-27SMALL.png'),
    "train-firstC21": require('../images/train-firstC21-27SMALL.png'),
    "train-lastC21": require('../images/train-lastC21-27SMALL.png'),
    "train-lastC12": require('../images/train-lastC12-27SMALL.png'),
    "train-lastnone": require('../images/train-lastnone-27SMALL.png'),
    "train-firstnone": require('../images/train-firstnone-27SMALL.png')
};
export const smallImages20 = {
    "train-lastnone": require('../images/train-lastnone-20SMALL.png'),
    "train-firstnone": require('../images/train-firstnone-20SMALL.png')
};

export const smallImageLengths = {
    27000: smallImages27,
    20000: smallImages20,
    general: imagesGeneral
};

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        profile: { type: DataTypes.STRING },
        name: { type: DataTypes.STRING },
        contact: { type: DataTypes.STRING },
        password: { type: DataTypes.STRING },
        unique_id: { type: DataTypes.INTEGER },
        solde: { type: DataTypes.FLOAT }
    },
    {
        timestamps: false,
        createdAt: false,
        updatedAt: false
    })
}
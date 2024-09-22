module.exports = (sequelize, DataTypes) => {
    return sequelize.define("History", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        unique_id:{type:DataTypes.INTEGER},
        date: { type: DataTypes.STRING },
        appareil: { type: DataTypes.STRING }
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false
    })
}
import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../db/connectDB";
import { Model, Optional } from "sequelize";

interface SubscriptionI {
  id: number;
  subtype: "basic" | "premium";
  active: boolean;
  expires: Date;
  amount: number;
  identifier: string;
  UserId?: number;
}

type SubscriptionCreationAttributes = Optional<SubscriptionI, "id">;

class Subscription
  extends Model<SubscriptionI, SubscriptionCreationAttributes>
  implements SubscriptionI
{
  public id!: number;
  public subtype!: "basic" | "premium";
  public active!: boolean;
  public expires!: Date;
  public amount!: number;
  public identifier!: string;
  public UserId!: number;
}

Subscription.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    subtype: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["basic", "premium"],
    },
    amount: {
      type: DataTypes.INTEGER,
      set: function () {
        const value = this.getDataValue("subtype") === "basic" ? 27.22 : 227.22;
        this.setDataValue("amount", value);
      },
    },
    identifier: {
        type: DataTypes.STRING,
        allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    expires: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true,
  }
);

export default Subscription;

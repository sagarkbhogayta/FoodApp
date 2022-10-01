const Order = require("./assignment1Order");
var menu = Object;
var totalPrice = 0;

menu = {
  Size: {
    size: {
      one: ["small", 10],
      two: ["medium", 20],
    },
  },
  Item: {
    item: {
      one: ["Punjabi Thali", 25],
      two: ["Gujarati Thali", 20],
    },
  },
  Combos: {
    combos: {
      one: ["Sabji Roti", 30],
      two: ["Dal Rice", 20],
    },
  },
  Drinks: {
    lassi: {
      one: ["mango lassi", 10],
      two: ["simple lassi", 5],
    },
  },
};

const OrderState = Object.freeze({
  ITEM: Symbol("welcoming"),
  REORDER: Symbol("welcoming"),
  SIZE: Symbol("size"),
  COMBOS: Symbol("combos"),
  DRINKS: Symbol("drinks"),
  PRICE: Symbol("price"),
});

module.exports = class ShwarmaOrder extends Order {
  constructor() {
    super();
    this.stateCur = OrderState.WELCOMING;
    this.sSize1 = null;
    this.sSize2 = "";
    this.sCombos1 = null;
    this.sCombos2 = "";
    this.sDrinks = "";
    this.sItem1 = null;
    this.sItem2 = null;
    this.sPrice = [];
  }
  handleInput(sInput) {
    let aReturn = [];
    switch (this.stateCur) {
      case OrderState.WELCOMING:
        this.stateCur = OrderState.ITEM;
        aReturn.push("Welcome to Desi Thali.");
        aReturn.push(
          "What thali would you like to Order?\n For Punjabi Thali type - 1 \n For Gujarati Thali type - 2"
        );
        break;

      case OrderState.ITEM:
        this.stateCur = OrderState.SIZE;
        if (this.sItem1 == null) {
          if (sInput == "1") {
            this.sItem1 = menu.Item.item.one[0];
            this.sPrice.push(menu.Item.item.one[1]);
          } else {
            this.sItem1 = menu.Item.item.two[0];
            this.sPrice.push(menu.Item.item.two[1]);
          }
          aReturn.push(
            "What size would you like?\n For small type - 1 \n For medium type -2"
          );
        } else {
          if (sInput == "1") {
            this.sItem2 = menu.Item.item.one[0];
            this.sPrice.push(menu.Item.item.one[1]);
          } else {
            this.sItem2 = menu.Item.item.two[0];
            this.sPrice.push(menu.Item.item.two[1]);
          }
          aReturn.push(
            "What size would you like?\n For small type - 1 \n For medium type -2"
          );
        }
        break;

      case OrderState.SIZE:
        this.stateCur = OrderState.COMBOS;
        if (this.sSize1 == null) {
          if (sInput == "1") {
            this.sSize1 = menu.Size.size.one[0];
            this.sPrice.push(menu.Size.size.one[1]);
          } else {
            this.sSize1 = menu.Size.size.two[0];
            this.sPrice.push(menu.Size.size.two[1]);
          }
          aReturn.push(
            "What combo would you like?\n For Sbaji Roti type - 1 \n For Dal Rice type -2"
          );
        } else {
          if (sInput == "1") {
            this.sSize2 = menu.Size.size.one[0];
            this.sPrice.push(menu.Size.size.one[1]);
          } else {
            this.sSize2 = menu.Size.size.two[0];
            this.sPrice.push(menu.Size.size.two[1]);
          }
          aReturn.push(
            "What combo would you like?\n For Sbaji Roti type - 1 \n For Dal Rice type -2"
          );
        }
        break;

      case OrderState.COMBOS:
        if (this.sCombos1 == null) {
          this.stateCur = OrderState.REORDER;
          if (sInput == "1") {
            this.sCombos1 = menu.Combos.combos.one[0];
            this.sPrice.push(menu.Combos.combos.one[1]);
          } else {
            this.sCombos2 = menu.Combos.combos.two[0];
            this.sPrice.push(menu.Combos.combos.two[1]);
          }
        } else {
          this.stateCur = OrderState.DRINKS;
          if (sInput == "1") {
            this.sCombos1 = menu.Combos.combos.one[0];
            this.sPrice.push(menu.Combos.combos.one[1]);
          } else {
            this.sCombos2 = menu.Combos.combos.two[0];
            this.sPrice.push(menu.Combos.combos.two[1]);
          }
        }
        aReturn.push("Would you like to add more Items ? (Y/N)");
        break;

      case OrderState.REORDER:
        if (sInput.toUpperCase() == "Y") {
          this.stateCur = OrderState.ITEM;
          aReturn.push(
            "What thali would you like to Order?\n For Punjabi Thali type - 1 \n For Gujarati Thali type - 2"
          );
        } else {
          this.stateCur = OrderState.DRINKS;
          aReturn.push(
            "What Kind of Lassi You would Like to have ?\n For Mango Lassi type - 1 \n for Salty Lassi type - 2 .\n For No lassi Type - 3"
          );
        }
        break;

      case OrderState.DRINKS:
        this.isDone(true);
        aReturn.push("Thank-you for your order!");
        if (sInput == "1") {
          this.sDrinks = menu.Drinks.lassi.one[0];
          this.sPrice.push(menu.Drinks.lassi.one[1]);
          aReturn.push(`You have Order ${this.sDrinks}`);
        } else if (sInput == "2") {
          this.sDrinks = menu.Drinks.lassi.two[0];
          this.sPrice.push(menu.Drinks.lassi.two[1]);
          aReturn.push(`You have Order ${this.sDrinks}`);
        }
        if (this.sItem2 != null) {
          aReturn.push(` ${this.sSize1} Size ${this.sItem1} and combo of ${this.sCombos1} 
           \n and ${this.sSize2} Size ${this.sItem2} and combo of ${this.sCombos2}`);
        } else {
          aReturn.push(
            ` ${this.sSize1} Size ${this.sItem1} and combo of ${this.sCombos1}`
          );
        }
        let d = new Date();
        d.setMinutes(d.getMinutes() + 20);
        aReturn.push(`Please pick it up at ${d.toTimeString()}`);
        calculate(this.sPrice);
        aReturn.push(`Please please dont Forget to pay ${totalPrice} CAD`);
        break;
    }
    return aReturn;
  }
};

function calculate(sPrice) {
  sPrice.forEach((price) => {
    totalPrice = totalPrice + price;
  });
  return totalPrice;
}

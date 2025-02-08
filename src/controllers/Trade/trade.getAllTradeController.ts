import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import { Trade } from "../../models/trades";
import { TradesPerson } from "../../models/tradePerson";


export const getAllTrades = catchAsync(async (req: Request, res: Response) => {
  const trades = await Trade.find();
  const tradeDetails = await Promise.all(trades.map(async (trade) => {
    const tradespeople = await TradesPerson.find({ trade: trade._id }).select("postcode");
    
    return {
      name: trade.name,
      description: trade.description,
      tradeImage: trade.tradeImage,
      skills: trade.skills,
      _id: trade._id,
      tradespeopleCount: tradespeople.length,
      postcodes: tradespeople.map(person => person.postCode)
    };
  }));

  res.status(200).json({
    success: true,
    message: "Trade Fetched Successfully!",
    results: trades.length,
    trades:tradeDetails,
  });
});




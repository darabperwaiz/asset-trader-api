import { Asset } from "../models/Asset.js";
import { Request } from "../models/Request.js";

// Request to Buy an Asset
export const createRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { proposedPrice } = req.body;

    const asset = await Asset.findById(id);

    if (!asset || asset.status !== "published") {
      return res.status(400).json({ message: "Invalid asset" });
    }

    if (asset.currentHolder.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot request to buy your own asset" });
    }

    const request = await Request.create({
      asset: id,
      proposedPrice,
      buyer: req.user._id,
    });
    res.status(201).json({ message: "Purchase request sent", requestId: request._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Negotiate Purchase Request
export const negotiate = async (req, res) => {
  try {
    const { id } = req.params;
    const { newProposedPrice } = req.body;

    const request = await Request.findById(id);
    if (!request)
      return res.status(400).json({ message: "No Purchase Request found!" });

    request.proposedPrice = newProposedPrice;
    await request.save();

    res.status(200).json({ message: "Negotiation updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Accept Purchase Request
export const acceptPurchaseRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);
    if (!request) {
      return res.status(400).json({ message: "No Purchase Request found!" });
    }

    const asset = await Asset.findById(request.asset);
    if (asset.currentHolder.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You do not have permission to respond to this request",
      });
    }

    request.status = "accepted";
    asset.tradingJourney.push({
      holder: request.buyer,
      price: request.proposedPrice,
    });
    asset.currentHolder = request.buyer;
    asset.lastTradingPrice = request.proposedPrice;
    asset.numberOfTransfers += 1;
    asset.averageTradingPrice = asset.tradingJourney.reduce(
      (sum, trade) => sum + trade.price,
      0
    );
    await asset.save();
    await request.save();

    res.status(200).json({ message: "Request accepted, holder updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const denyPurchaseRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);
    if (!request) {
      return res.status(400).json({ message: "No Purchase Request found!" });
    }

    // const asset = await Asset.findById(request.asset);
    // if (asset.currentHolder.toString() !== req.user._id.toString()) {
    //   return res
    //     .status(403)
    //     .json({
    //       message: "You do not have permission to respond to this request",
    //     });
    // }

    request.status = "denied";
    await request.save();

    res.status(200).json({ message: "Request denied" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get User's Purchase Requests
export const usersPurchaseRequsts = async (req, res) => {
  try {
    const { id } = req.params;
    const requests = await Request.find({ buyer: id });
    if (!requests || requests.length == 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(requests);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import { Asset } from "../models/Asset.js";
import { User } from "../models/User.js";


// Create Asset / Save as Draft
export const createAsset = async (req, res) => {
  try {
    const { name, description, image, status } = req.body
    const asset = await Asset.create({
      name,
      description,
      image,
      status,
      creator: req.user._id,
      currentHolder: req.user._id,
      tradingJourney: [{ holder: req.user._id }],
    });

    res
      .status(201)
      .json({ message: "Asset created successfully", assetId: asset._id })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
};


// Update Asset
export const updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findById(id);
    if (!asset) return res.status(404).json({ message: "Asset not found" })
    if (asset.creator.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You do not have permission to update this asset" })
    }
    Object.assign(asset, req.body);
    if(req.body.status == 'draft') {
        asset.isListed = false
    } else {
        asset.isListed = true
    }
    await asset.save();
    res.status(200).json({ message: "Asset updated successfully", assetId: asset._id })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
};


// List Asset on Marketplace
export const publishAsset = async (req, res) => {
    try {
    const {id} = req.params
    const asset = await Asset.findById(id)
    if (!asset) return res.status(404).json({ message: "Asset not found" })

    asset.status = 'published'
    asset.isListed = true
    await asset.save()
    res.status(200).json({message: "Asset published successfully"})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }


}

// Get Asset Details
export const getAssetById = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findById(id)
    // .populate(
    //   "creator currentHolder tradingJourney.holder",
    //   "username email"
    // );
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" })
    }
    res.status(200).json(asset);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
};


// Get User's Assets
export const getUserAssets = async (req, res) => {
    try {
        const {id} = req.params
    const user = await User.findById(id)
    if(!user) {
        return res.status(404).json({message: "User not found"})
    }

    const assets = await Asset.find({currentHolder: id})
    // if(assets.)
    res.status(200).json(assets)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Get Assets on Marketplace
export const getAssetsOnMarketplace = async (req, res) => {
    try {
        const assets = await Asset.find({status: 'published'})
        res.status(200).json(assets)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}



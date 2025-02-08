const expenseModel = require("../../Schema/expenses/expense.model");
const mongoose = require("mongoose");
const logger = require("../../Config/logger.config");
const { expenseCategory } = require("../../Constants/model.constants");
const errorHandling = require("../../Utils/errorHandling");

// -----------------------------------------------------
// GRAPHQL RESOLVERS
// -----------------------------------------------------
const expenseGraphController = async (req, res, next) => {
  try {
    logger.info("Controller - graph-expenses - expenseGraphController - Start");
    const expenseTypeGraphAggregation = [
      {
        $match: {
          mosqueId: new mongoose.Types.ObjectId(req.mosqueId),
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: expenseCategory,
          localField: "_id",
          foreignField: "_id",
          as: "expenseType",
        },
      },

      {
        $project: {
          _id: 1,
          count: 1,
          expenseType: { $arrayElemAt: ["$expenseType.name", 0] },
        },
      },
    ];

    const expenseStatusGraphAggregation = [
      {
        $match: {
          mosqueId: new mongoose.Types.ObjectId(req.mosqueId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ];

    const expensePaymentGraphAggregation = [
      {
        $match: {
          mosqueId: new mongoose.Types.ObjectId(req.mosqueId),
        },
      },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
        },
      },
    ];

    const expenseTypeGraph = await expenseModel.aggregate(
      expenseTypeGraphAggregation
    );

    let expenseStatusGraph = await expenseModel.aggregate(
      expenseStatusGraphAggregation
    );
    const enumStatus = ["paid", "pending"];
    expenseStatusGraph = expenseStatusGraph.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    expenseStatusGraph = enumStatus.map((status) => ({
      status,
      count: expenseStatusGraph[status] || 0,
    }));

    let expensePaymentGraph = await expenseModel.aggregate(
      expensePaymentGraphAggregation
    );
    const enumPaymentMethod = ["cash", "UPI", "card", "check", "other"];
    expensePaymentGraph = expensePaymentGraph.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    expensePaymentGraph = enumPaymentMethod.map((status) => ({
      mode: status,
      count: expensePaymentGraph[status] || 0, // Default to 0 if not found
    }));

    logger.info("Controller - graph-expenses - expenseGraphController - End");
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        expenseTypeGraph,
        expenseStatusGraph,
        expensePaymentGraph,
      },
    });
  } catch (error) {
    logger.error(
      "Controller - graph-expenses - expenseGraphController - error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

const expensePayeeGraphController = async (req, res, next) => {
  const { payeeId } = req.params;
  try {
    logger.info(
      "Controller - graph-expenses - expensePayeeGraphController - Start"
    );
    const payeeExpenseTypeGraphAggregation = [
      {
        $match: {
          mosqueId: new mongoose.Types.ObjectId(req.mosqueId),
          payeeId: new mongoose.Types.ObjectId(payeeId),
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: expenseCategory,
          localField: "_id",
          foreignField: "_id",
          as: "expenseType",
        },
      },

      {
        $project: {
          _id: 1,
          count: 1,
          eventType: { $arrayElemAt: ["$expenseType.name", 0] },
        },
      },
    ];

    const payeeExpenseStatusGraphAggregation = [
      {
        $match: {
          mosqueId: new mongoose.Types.ObjectId(req.mosqueId),
          payeeId: new mongoose.Types.ObjectId(payeeId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ];

    const payeeExpensePaymentGraphAggregation = [
      {
        $match: {
          mosqueId: new mongoose.Types.ObjectId(req.mosqueId),
          payeeId: new mongoose.Types.ObjectId(payeeId),
        },
      },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
        },
      },
    ];

    const payeeExpenseTypeGraph = await expenseModel.aggregate(
      payeeExpenseTypeGraphAggregation
    );
    const payeeExpenseStatusGraph = await expenseModel.aggregate(
      payeeExpenseStatusGraphAggregation
    );
    const payeeExpensePaymentGraph = await expenseModel.aggregate(
      payeeExpensePaymentGraphAggregation
    );

    logger.info(
      "Controller - graph-expenses - expensePayeeGraphController - End"
    );
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        payeeExpenseTypeGraph,
        payeeExpenseStatusGraph,
        payeeExpensePaymentGraph,
      },
      type: "payee expense graph",
    });
  } catch (error) {
    logger.error(
      "Controller - graph-expenses - expensePayeeGraphController - error",
      error
    );
    errorHandling.handleCustomErrorService(error, next);
  }
};

module.exports = {
  expenseGraphController,
  expensePayeeGraphController,
};

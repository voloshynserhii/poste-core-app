export const statuses = [
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "accepted",
    label: "Accepted",
    details: [
      { 
        value: "modified",
        label: "Modified by dispatcher",
      },
      { 
        value: "collected",
        label: "Collected from sender",
      }
    ]
  },
  {
    value: "inTransit",
    label: "In Transit",
    details: [
      {
        value: "collectionTerminal",
        label: "In Collection Terminal",
      },
      {
        value: "onRoute",
        label: "On The Way To Terminal",
      },
      {
        value: "deliveryTerminal",
        label: "In Delivery Terminal",
      },
      {
        value: "lastMileCurier",
        label: "Last Mile Curier",
      },
      {
        value: "delay",
        label: "Delay (ready for last mile delivery)",
      },
    ],
  },
  {
    value: "delivered",
    label: "Delivered",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    details: [
      {
        value: "cancelledDispatcher",
        label: "Cancelled By Dispatcher",
      },
      {
        value: "cancelledClient",
        label: "Cancelled By Client (not billable)",
      },
    ],
  },
  {
    value: "cancelledBillabale",
    label: "Cancelled (Billabale)",
    details: [
      {
        value: "receiverNotFound",
        label: "Receiver not found",
      },
      {
        value: "sentBack",
        label: "Return to sender",
      },
      {
        value: "failed",
        label: "Failed to deliver",
      },
    ],
  },
];

export default statuses;

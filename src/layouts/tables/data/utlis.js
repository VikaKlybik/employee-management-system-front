class TableUtils {
  identifyColorForProgress(value) {
    if (value <= 30) {
      return "error";
    } else if (value >= 95) {
      return "success";
    } else {
      return "info";
    }
  }

  identifyStatus(status) {
    const statuses =
      [
        {
          status: "DRAFT",
          name: "Черновик",
          color: "light",
        },
        {
          status: "PUBLISHED",
          name: "В процессе",
          color: "info",
        },
        {
          status: "CLOSED",
          name: "Завершён",
          color: "success",
        },
      ];
    return statuses.find(s => s.status === status) || null;
  };

  identifyStatusDevelopmentPlan(status) {
    const statuses =
      [
        {
          status: "STARTED",
          name: "Поставлен",
          color: "info",
        },
        {
          status: "COMPLETED",
          name: "Выполнен",
          color: "success",
        },
        {
          status: "FAILED",
          name: "Завершён",
          color: "error",
        },
        {
          status: "CANCELLED",
          name: "Отменена",
          color: "warning",
        },
      ];
    return statuses.find(s => s.status === status) || null;
  };

  getMethodName(method) {
    const methods =
      [
        {
          method: "METHOD_270",
          name: "Метод 270",
        },
        {
          method: "METHOD_360",
          name: "Метод 360",
        },
      ];
    return methods.find(m => m.method === method) || null;
  }
}

export default TableUtils;
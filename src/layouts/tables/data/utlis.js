class TableUtils {
    identifyColor(value) {
      if(value <= 30) {
        return "error";
      } else if (value >= 95) {
        return "success";
      } else {
        return "info";
      }
    }
}
export default TableUtils;
export const formatChartData = (patients: any[]) => {
    const result = [];
    const today = new Date();
  
    // Loop through the past 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(); // Create a new date object for each iteration
      date.setDate(today.getDate() - i); // Go back 'i' days from today
      const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD format
  
      // Count how many patients were added on this date
      const count = patients.filter(p => p.addedAt.startsWith(dateStr)).length;
      
      // Push the formatted data into the result array
      result.push({ day: dateStr, count });
    }
  
    return result;
  };
  
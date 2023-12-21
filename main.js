import * as JSC from "jscharting";
import { M } from "./js/model.js";
import { V } from "./js/view.js";

/*
   Ce fichier correspond au contrôleur de l'application. Il est chargé de faire le lien entre le modèle et la vue.
   Le modèle et la vue sont définis dans les fichiers js/model.js et js/view.js et importés (M et V, parties "publiques") dans ce fichier.
   Le modèle contient les données (les événements des 3 années de MMI).
   La vue contient tout ce qui est propre à l'interface et en particulier le composant Toast UI Calendar.
   Le principe sera toujours le même : le contrôleur va récupérer les données du modèle et les passer à la vue.
   Toute opération de filtrage des données devra être définie dans le modèle.
   Et en fonction des actions de l'utilisateur, le contrôleur pourra demander au modèle de lui retourner des données filtrées
   pour ensuite les passer à la vue pour affichage.

   Exception : Afficher 1, 2 ou les 3 années de formation sans autre filtrage peut être géré uniquement au niveau de la vue.
*/

// loadind data (and wait for it !)
await M.init();

let all = [...M.getEvents("mmi1"), ...M.getEvents('mmi2'), ...M.getEvents("mmi3")]
console.log(all)
        
function renderTimes(data) {
  var chart = JSC.chart('chartDiv', {
      debug: true,
      type: 'line',
      legend_visible: true,
      xAxis: {
          crosshair_enabled: true,
          scale: { type: 'time' }
      },
      yAxis: { orientation: 'opposite', },
      defaultSeries: {
          firstPoint_label_text: '<b>%seriesName</b>',
          defaultPoint_marker: {
              type: 'none',
          }
      },
      defaultPoint: {
          tooltip: '<b>%seriesName:</b> %valueh'
      },
      title_label_text: 'Heure de fin des cours par jour et par groupe',
      series: data
  });
}

function formatDataForChart(data) {
  let formattedData = [];
  data.forEach(groupData => {
      let groupName = groupData[0];
      let points = [];

      for (let i = 1; i < groupData.length; i++) {
          let date = groupData[i][0];
          let value = groupData[i][1];
          points.push([date, value]);
      }

      formattedData.push({
          name: groupName,
          points: points
      });
  });

  renderTimes(formattedData);
}

function getDernierCours(events) {
  let groupedEvents = {};

  events.forEach(event => {
      event.groups.forEach(group => {
          if (!groupedEvents[group]) {
              groupedEvents[group] = {};
          }
          let date = new Date(event.start);
          let formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
          let decimalEndTime = parseFloat(event.heurefin);
          if (!groupedEvents[group][formattedDate] || decimalEndTime > groupedEvents[group][formattedDate]) {
              groupedEvents[group][formattedDate] = decimalEndTime;
          }
      });
  });

  let tab = [];
  for (let group in groupedEvents) {
      let groupData = [group];
      for (let date in groupedEvents[group]) {
          groupData.push([date, groupedEvents[group][date]]);
      }
      tab.push(groupData);
  }

  console.log(tab)
  formatDataForChart(tab)
}

getDernierCours(all)

function handler_click(ev) {
  if (ev.target.id == 'group') {
      let result;
      if (ev.target.value == "tout") {
          result = all;
      }
      else {
          result = M.EventAllByGroup("group", ev.target.value);
      }
      renderTimes(result);
  }

  if (ev.target.id == 'week') {
      let result;
      result = M.EventAllByGroup("week", ev.target.value);
      getDernierCours(result);
  }
}

export { handler_click };
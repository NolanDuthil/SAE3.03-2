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
  
var widgetOptions = [
    {
        debug: false,
        defaultSeries_type: 'column',
        title_label_text: 'Heures de cours par semaine en MMI',
        yAxis: {
            defaultTick_enabled: true,
            scale_range_padding: 0.15
        },
        legend_visible: true,
        toolbar_visible: false,
        series: [
            {
                name: 'Heures de cours total',
                color: '#ABA0F9',
                defaultPoint: {
                    label: { text: '%value' }
                },
                points: chartData
            }
        ]
    },




];

var chart1 = new JSCWidgets.BarColumn('chartDiv1', widgetOptions[0]),
chart2 = new JSCWidgets.BarColumn('chartDiv2', widgetOptions[1]),
chart3 = new JSCWidgets.BarColumn('chartDiv3', widgetOptions[2]),
chart4 = new JSCWidgets.BarColumn('chartDiv4', widgetOptions[3])
        var chart = JSC.chart('chartDiv', {
            debug: true,
            defaultSeries_type: 'column',
            title_label_text: 'Fin des cours',
            yAxis: { label_text: 'Heures' },
            xAxis: {
              label_text: 'Groupe',
              categories: ['BUT1-G1', 'BUT1-G21', 'BUT1-G22', 'BUT1-G3', 'BUT2-G1', 'BUT2-G21', 'BUT2-G22', 'BUT2-G3', 'BUT3-G1', 'BUT3-G21', 'BUT3-G22', 'BUT3-G3']
            },
            series: [
              {
                name: 'Lundi',
                id: 's1',
                points: [17, 16,19,19,14, 19, 19,18,19,19,19,19]
              },
              { name: 'Mardi', points: [19, 19,19,12,19, 19, 17,19,19,16,19,19] },
              { name: 'Mercredi', points: [19, 19,19,17,19, 19, 19,19,19,19,11,19] },
              { name: 'Jeudi', points: [19, 19,17,19,19, 19, 13,19,19,19,18,19] },
              { name: 'Vendredi', points: [19, 19,19.5,19,19, 19, 17.5,19,19,19,19,19] }
            ]
          });
          
function handler_click(ev) {
    if (ev.target.id == 'group') {
        let result;
        if (ev.target.value == "tout") {
            result = all;
        }
        else {
            result = M.EventAllByGroup(ev.target.value);
        }
        renderTimes(result);
    }
}



export { handler_click };
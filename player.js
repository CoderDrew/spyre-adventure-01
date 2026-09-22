(() => {
  'use strict';
  const assets = Object.freeze({
  "10": "assets/10-apt-seventeen-elsies_room.png",
  "11": "assets/11-sable_house_blocked_door.png",
  "12": "assets/12-sable_house_main_room.png",
  "13": "assets/13-sable_house_reliquary.png",
  "14": "assets/14-sable_house_containment_room.png",
  "15": "assets/15-hearth_and_thorn_external.png",
  "16": "assets/16-hearth_and_thorn_internal.png",
  "16a": "assets/16a-deepthorn.png",
  "17": "assets/17-the_broken_compass.png",
  "18": "assets/18-ragling.png",
  "19": "assets/19-Veys_External.png",
  "20": "assets/20-Veys_Internal.png",
  "21": "assets/21-Veys_ragling_nest.png",
  "22": "assets/22-ragling-attacking.png",
  "23": "assets/23-tallow_street_survey.png",
  "24": "assets/24-Veys_Courtyard.png",
  "25": "assets/25-Veys_Symbol.png",
  "26": "assets/26-the_crooked_nail.png",
  "27": "assets/27-Mara.png",
  "01": "assets/01-wide_cinematic_gritty_fantasy_medieval_harbor_ci.png",
  "02": "assets/02-Hutch.png",
  "03": "assets/03-fool_and_fortune_curiosity_shop.png",
  "04": "assets/04-tallow_street_map_handout_01.png",
  "05": "assets/05-tallow_street_player_view.png",
  "06": "assets/06-gilded_kraken_main_room.png",
  "07": "assets/07-gilded_kraken_cellar.png",
  "08": "assets/08-marlowes_fine_goods.png",
  "09": "assets/09-apt-seventeen-main-floor.png"
});
  const token = decodeURIComponent(location.hash.slice(1));
  if (Object.prototype.hasOwnProperty.call(assets, token)) {
    document.querySelector('img').src = assets[token];
  }
})();

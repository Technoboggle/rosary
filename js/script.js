
'use strict';

var dailyMystery, day, prayerTotal = 0;

// gets day and converts it to string
day = (function(){
		var d = new Date();
		var n = d.getDay();

		switch (n){
			case 0:
				return "Sunday";
				break;
			case 1:
				return "Monday";
				break;
			case 2:
				return "Tuesday";
				break;
			case 3:
				return "Wednesday";
				break;
			case 4:
				return "Thursday";
				break;
			case 5:
				return "Friday";
				break;
			case 6:
				return "Saturday";
				break;
		}
	}
)();


var prayers = [
	{
		name: "Apostles' Creed",
		text: "I believe in one God, the Father Almighty. Creator of Heaven and earth. I believe in Jesus Christ, His only Son, our Lord. He was conceived by the power of the Holy Spirit, and was born of the Virgin Mary. He suffered under Pontius Pilate, was crucified, died, and was buried. He descended into the dead, and on the third day He rose again. He ascended into Heaven and He is seated at the right hand of the Father. He will come again to judge the living and the dead. I believe in the Holy Spirit, the Holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting, Amen."
	},
	{
		name: "Our Father",
		text: "Our Father, who art in Heaven, hallowed be Thy name. Thy kingdom come, Thy will be done, on earth as it is in Heaven. Give us this day, our daily bread, and forgive us our trespasses. As we forgive those who trespass against us, and lead us not into temptation, but deliver us from evil. Amen."

	}, 
	{
		name: "Hail Mary",
		text: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou amongst women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the our of our death. Amen."
	}, 
	{
		name: "Glory Be",
		text: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now and forever shall be, world without end. Amen."
	},
	{
		name: "Oh My Jesus",
		text: "Oh my Jesus. Forgive us our sins. Save us from the fires of hell. Lead all souls to Heaven, especially those most in need of Thy mercy."
	},
	{
		name: "Hail Holy Queen",
		text: "Haily Holy Queen, Mother of Mercy, our life, our sweetness, and our hope. To Thee do we cry, poor banished children of Eve. To Thee do we send up our sighs, mourning and weeping in this vale of tears. Turn then, most gracious advocate, Thine eyes of mercy toward us. And after this, our exile, show us unto the Blessed fruit of Thy womb, Jesus. Oh clement, oh loving, oh sweet Virgin Mary. Pray for us, oh Holy Mother of God, that we may be made worthy of the promises of Christ."
	}
];

var opener = prayers.slice(0, 4);

var mysteries = [
	{
		name: 'Joyful',
		decade: ['Annunciation', 'Visitation', 'Nativity','Presentation', 'Finding of Jesus in the Temple'],
		prayer: prayers
	},
	{
		name: 'Sorrowful',
		decade: ['Agony in the Garden', 'Scourging at Pillar', 'Crowning With Thorns','Carrying of Cross', 'Crucifixion'],
		prayer: prayers
	},
	{
		name: 'Glorious',
		decade: ['Resurrection', 'Ascension', 'Descent of Holy Spirit','Assumption', 'Coronation'],
		prayer: prayers
	},
	{
		name: 'Luminous',
		decade: ['Baptism of Jesus', 'Wedding of Cana', 'Proclamation of the Kingdom', 'Transfiguration', 'Institution of the Eucharist'],
		prayer: prayers
	}
];


/* ++++++++++++ Logic to determine the day's mystery ++++++++++++ */
// Joyful
if (day === "Monday" || day === "Saturday"){
	dailyMystery = mysteries[0];
}
// Sorrowful
else if (day === "Tuesday" || day === "Friday"){
	dailyMystery = mysteries[1];
}
// Glorious
else if (day === "Sunday" || day === "Wednesday"){
	dailyMystery = mysteries[2];
}
// Luminous
else{
	dailyMystery = mysteries[3];
}


/* ++++++ Angular stuff ++++++ */

(function(){

	var app = angular.module('rosary', []);

	app.controller('RosaryController', function(){
		this.mystery = dailyMystery;
		this.openingPrayers = opener;
		this.done = false;

		// checks if opening prayers are done, default false
		this.openingDone = false;

		// tracks decade number
		this.decade = 0;

		// tracks number WITHIN decade
		this.prayerCount = 0;


		this.add = function(){
			prayerTotal++;
			if (this.openingDone === true){
				this.prayerCount++;

				if (this.prayerCount >= 13){
					this.prayerCount = 0;

					if (this.decade !== 4){
						this.decade++;
					}
					else if (this.decade === 4){
						this.done = true;
					}
				}

			}

			else if (prayerTotal > 5){
				this.openingDone = true;
				return true;
			}

		};


		this.subtract = function(amount){
			if (prayerTotal > 0){
				prayerTotal--;	
				// console.log(prayerTotal);
				if (prayerTotal <= 5){
					this.openingDone = false;
				}
				if (this.openingDone == true){
					this.prayerCount--;
				}
			}
		};

		this.showPrayerName = function(){
			if (this.openingDone !== true){
				if (prayerTotal > 1 && prayerTotal < 5){
					return this.openingPrayers[2].name;
				}
				else if (prayerTotal === 5){
					return this.openingPrayers[3].name;
				}
				else{
					return this.openingPrayers[prayerTotal].name;
				}
			}

			else if (this.openingDone === true){

			}	
		};

		this.showPrayer = function(){
			// opening prayers
			if (this.openingDone !== true){
				if (prayerTotal > 1 && prayerTotal < 5){
					return this.openingPrayers[2].text;
				}
				else if (prayerTotal === 5){
					return this.openingPrayers[3].text;
				}
				else{
					return this.openingPrayers[prayerTotal].text;
				}
			}

			else if (this.openingDone === true && this.done === false){
				// returns Our Father
				if (this.prayerCount === 0){
					return this.mystery.prayer[1].text;
				}

				//returns Hail Mary
				else if(this.prayerCount <= 10 && this.prayerCount >= 1){
					return this.mystery.prayer[2].text;
				}

				// returns Glory Be
				else if (this.prayerCount === 11){
					return this.mystery.prayer[3].text;
				}

				// returns Fatima Prayer
				else if (this.prayerCount === 12){
					return this.mystery.prayer[4].text;
				}
			}

			// Hail Holy Queen
			else if (this.done === true){
				return this.mystery.prayer[5].text;
			}
		};

		this.startOver = function(){
			this.done = false;
			this.openingDone = false;
			this.decade = 0;
			this.prayerCount = 0;
			prayerTotal = 0;
		};

	});

})();


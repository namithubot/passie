/**
 * Idea:
 * Use X or A to set the intensity
 * and forward click button to set duration.
 * Parameters: Intensity, duration, position
 * Combinations: 2 * 4 * 4 * 3 * 6 * 10 = 5760
 * 8 character password: Around 50 ** 8 = 39,062,500,000,000
 * 4 digit PIN: 10000
 */

function clamp(min, max, value) {
  return Math.min(max, Math.max(min, value));
}

const passwordData = [];

AFRAME.registerComponent("passie-intensity-control", {
  schema: {
    duration: { type: "number", default: 100 },
    intensity: { type: "number", default: 1.0 },
  },

  init: function () {
    var el = this.el;
	var self  = this;
    el.addEventListener("ybuttondown", function (evt) {
      self.data.intensity = clamp(0, 1, self.data.intensity + 0.3);
	  el.setAttribute('haptics', `events: triggerdown; dur: 1000; force: ${self.data.intensity}`);
	  el.components.haptics.data.force = self.data.intensity;
    });

    el.addEventListener("xbuttondown", function (evt) {
      self.data.intensity = clamp(0, 1, self.data.intensity - 0.3);
	  el.setAttribute('haptics', `events: triggerdown; dur: 1000; force: ${self.data.intensity}`);
	  el.components.haptics.data.force = self.data.intensity;

    });

    el.addEventListener("bbuttondown", function (evt) {
		self.data.intensity = clamp(0, 1, self.data.intensity + 0.3);
		el.setAttribute('haptics', `events: triggerdown; dur: 1000; force: ${self.data.intensity}`);
		el.components.haptics.data.force = self.data.intensity;

    });

    el.addEventListener("abuttondown", function (evt) {
		self.data.intensity = clamp(0, 1, self.data.intensity - 0.3);
		el.setAttribute('haptics', `events: triggerdown; dur: 1000; force: ${self.data.intensity}`);
		el.components.haptics.data.force = self.data.intensity;

    });

    el.addEventListener("gripdown", function (evt) {
		passwordData.push({
			intensity: self.data.intensity,
			duration: self.data.duration,
			position: self.el.object3D.position.clone(),
			rotation: self.el.object3D.quaternion,
			hand: self.el.id.includes('left') + 1,
		});

		// self.el.object3D.position.angleTo(temp1)
		// gripdown
    });

	el.addEventListener('triggerdown', function (evt) {
		const angles = [0];

		for (let i = 1; i < passwordData.length; i++) {
			angles.push(passwordData[i].position.angleTo(passwordData[i - 1].position));
		}

		const password = passwordData
			.map((data, i) => `${data.hand}|${data.intensity}|${angles[i]}`)
			.join(',');
		document.dispatchEvent(new CustomEvent('password-recorded-spatial', { detail: { password } }));
		passwordData = [];
	});
  },

  tick: function() {

  }
});

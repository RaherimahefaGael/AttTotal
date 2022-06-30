let voitureRef = db.collection('voiture').orderBy("createdAt","desc");
let deleteIDs = [];

// REAL TIME LISTENER
voitureRef.onSnapshot(snapshot => {
	let changes = snapshot.docChanges();
	changes.forEach(change => {
		if (change.type == 'added') {
			console.log('added');
		} else if (change.type == 'modified') {
			console.log('modified');
		} else if (change.type == 'removed') {
			$('tr[data-id=' + change.doc.id + ']').remove();
			console.log('removed');
		}
	});
});

// GET TOTAL SIZE
voitureRef.onSnapshot(snapshot => {
	let size = snapshot.size;
	$('.count').text(size);
	if (size == 0) {
		$('#selectAll').attr('disabled', true);
	} else {
		$('#selectAll').attr('disabled', false);
	}
});


const displayVoitures = async (doc) => {
	console.log('displayVoitures');

	let voitures = voitureRef;
	// .startAfter(doc || 0).limit(10000)

	const data = await voitures.get();

	data.docs.forEach(doc => {
		const voiture = doc.data();
		let item =
			`<tr data-id="${doc.id}">
					<td>
							<span class="custom-checkbox">
									<input type="checkbox" id="${doc.id}" name="options[]" value="${doc.id}">
									<label for="${doc.id}"></label>
							</span>
					</td>
					
					<td class="voiture-matricule">${voiture.matricule}</td>
					<td class="voiture-cin">${voiture.cin}</td>
					<td class="voiture-telephone">${voiture.telephone}</td>
					<td class="voiture-coperative">${voiture.Nom_Coperative}</td>
					<td class="voiture-chauffeur">${voiture.chauffeur}</td>
					<td>
							<a href="#" id="${doc.id}" class="edit js-edit-voiture"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
							</a>
							<a href="#" id="${doc.id}" class="delete js-delete-voiture"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
							</a>
					</td>
			</tr>`;

		$('#voiture-table').append(item);

		// ACTIVATE TOOLTIP
		$('[data-toggle="tooltip"]').tooltip();

		// SELECT/DESELECT CHECKBOXES
		var checkbox = $('table tbody input[type="checkbox"]');
		$("#selectAll").click(function () {
			if (this.checked) {
				checkbox.each(function () {
					console.log(this.id);
					deleteIDs.push(this.id);
					this.checked = true;
				});
			} else {
				checkbox.each(function () {
					this.checked = false;
				});
			}
		});
		checkbox.click(function () {
			if (!this.checked) {
				$("#selectAll").prop("checked", false);
			}
		});
	})

	// UPDATE LATEST DOC
	latestDoc = data.docs[data.docs.length - 1];

	// UNATTACH EVENT LISTENERS IF NO MORE DOCS
	if (data.empty) {
		$('.js-loadmore').hide();
	}
}

// ADD TEST DATA
function addTestData() {
	const voituresdata = [{
		
			"matricule": "1234TBE",
			"cin": "101101101101",
			"telephone": "0341122233",
			"Nom_Coperative": "Kofiam",
			"chauffeur": "Elie"
		}
	];

	voituresdata.forEach(voiture => {
		console.log(voiture);
		db.collection('voiture').add({
			
				matricule: voiture.matricule,
				cin: voiture.cin,
				telephone: voiture.telephone,
				Nom_Coperative: voiture.Nom_Coperative,
				chauffeur: voiture.chauffeur,
				createdAt : firebase.firestore.FieldValue.serverTimestamp()
			}).then(function () {
				console.log("Document successfully written!");
			})
			.catch(function (error) {
				console.error("Error writing document: ", error);
			});
	});
}

// addTestData();

$(document).ready(function () {

	let latestDoc = null;

	// LOAD INITIAL DATA
	displayVoitures();
	
	// LOAD MORE
	$(document).on('click', '.js-loadmore', function () {
		displayVoitures(latestDoc);
	});

	// ADD voiture
	$("#add-voiture-form").submit(function (event) {
		event.preventDefault();
		
		let voi_mat = $('#voiture-matricule').val();
		let voi_cin = $('#voiture-cin').val();
		let voi_tel =  $('#voiture-telephone').val();
		let voi_cop = $('#voiture-coperative').val();
		let voi_chauf = $('#voiture-chauffeur').val();
		db.collection('voiture').add({
			
			matricule: voi_mat,
			cin: voi_cin,
			telephone: voi_tel,
			Nom_Coperative: voi_cop,
			chauffeur: voi_chauf,
			createdAt : firebase.firestore.FieldValue.serverTimestamp()
			}).then(function (docRef) {
				console.log("Document written with ID: ", docRef.id);
				$("#addVoitureModal").modal('hide');

				let newVoiture =
				`<tr data-id="${docRef.id}">
						<td>
								<span class="custom-checkbox">
										<input type="checkbox" id="${docRef.id}" name="options[]" value="${docRef.id}">
										<label for="${docRef.id}"></label>
								</span>
						
								<a href="#" id="${docRef.id}" class="edit js-edit-voiture"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
								</a>
								<a href="#" id="${docRef.id}" class="delete js-delete-voiture"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
								</a>
						</td>
				</tr>`;

			$('#voiture-table tbody').prepend(newVoiture);
			})
			.catch(function (error) {
				console.error("Error writing document: ", error);
			});
	});

    // UPDATE VOiture
	$(document).on('click','.js-edit-voiture', function (e) {
		e.preventDefault();
		let id = $(this).attr('id');
		$('#edit-voiture-form').attr('edit-id', id);
		db.collection('voiture').doc(id).get().then(function (document) {
			if (document.exists) {
				
				$('#edit-voiture-form #voiture-matricule').val(document.data().matricule);
				$('#edit-voiture-form #voiture-cin').val(document.data().cin);
				$('#edit-voiture-form #voiture-telephone').val(document.data().telephone);
				$('#edit-voiture-form #voiture-coperative').val(document.data().Nom_Coperative);
				$('#edit-voiture-form #voiture-chauffeur').val(document.data().chauffeur);
				$('#editVoitureModal').modal('show');
			} else {
				console.log("No such document!");
			}
		}).catch(function (error) {
			console.log("Error getting document:", error);
		});
	});
    
	$("#edit-voiture-form").submit(function (event) {
		event.preventDefault();
		let id = $(this).attr('edit-id');
		let voi_mat = $('#edit-voiture-form #voiture-matricule').val();
		let voi_cin = $('#edit-voiture-form #voiture-cin').val();
		let voi_tel =  $('#edit-voiture-form  #voiture-telephone').val();
		let voi_cop = $('#edit-voiture-form #voiture-coperative').val();
		let voi_chauf = $('#edit-voiture-form #voiture-chauffeur').val();

		db.collection('voiture').doc(id).update({
			
			matricule: voi_mat,
			cin: voi_cin,
			telephone: voi_tel,
			Nom_Coperative: voi_cop,
			chauffeur: voi_chauf,
			updatedAt : firebase.firestore.FieldValue.serverTimestamp()
		});

		$('#editVoitureModal').modal('hide');

		// SHOW UPDATED DATA ON BROWSER
		
		$('tr[data-id=' + id + '] td.voiture-matricule').html(voi_mat);
		$('tr[data-id=' + id + '] td.voiture-cin').html(voi_cin);
		$('tr[data-id=' + id + '] td.voiture-telephone').html(voi_tel);
		$('tr[data-id=' + id + '] td.voiture-coperative').html(voi_cop);
		$('tr[data-id=' + id + '] td.voiture-chauffeur').html(voi_chauf);
	});

    	// DELETE EMPLOYEE
	$(document).on('click', '.js-delete-voiture', function (e) {
		e.preventDefault();
		let id = $(this).attr('id');
		$('#delete-voiture-form').attr('delete-id', id);
		$('#deleteVoitureModal').modal('show');
	});

	$("#delete-voiture-form").submit(function (event) {
		event.preventDefault();
		let id = $(this).attr('delete-id');
		if (id != undefined) {
			db.collection('voiture').doc(id).delete()
				.then(function () {
					console.log("Document successfully delete!");
					$("#deleteVoitureModal").modal('hide');
				})
				.catch(function (error) {
					console.error("Error deleting document: ", error);
				});
		} else {
			let checkbox = $('table tbody input:checked');
			checkbox.each(function () {
				db.collection('voiture').doc(this.value).delete()
					.then(function () {
						console.log("Document successfully delete!");
						displayVoitures();
					})
					.catch(function (error) {
						console.error("Error deleting document: ", error);
					});
			});
			$("#deleteVoitureModal").modal('hide');
		}
	});
})
$("#addVoitureModal").on('hidden.bs.modal', function () {
    $('#add-voiture-form .form-control').val('');

	$("#editVoitureModal").on('hidden.bs.modal', function () {
		$('#edit-voiture-form .form-control').val('');
	});
    
});




// CENTER MODAL
(function ($) {
	"use strict";

	function centerModal() {
		$(this).css('display', 'block');
		var $dialog = $(this).find(".modal-dialog"),
			offset = ($(window).height() - $dialog.height()) / 2,
			bottomMargin = parseInt($dialog.css('marginBottom'), 10);

		// Make sure you don't hide the top part of the modal w/ a negative margin if it's longer than the screen height, and keep the margin equal to the bottom margin of the modal
		if (offset < bottomMargin) offset = bottomMargin;
		$dialog.css("margin-top", offset);
	}

	$(document).on('show.bs.modal', '.modal', centerModal);
	$(window).on("resize", function () {
		$('.modal:visible').each(centerModal);
	});
}(jQuery));
	
coperativepage.addEventListener('click', (e) => {
        window.location.href = "index1.html";
    })
propriopage.addEventListener('click', (e) => {
		window.location.href = "proprio.html";
	})

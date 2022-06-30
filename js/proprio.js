let proprioRef = db.collection('proprio').orderBy("createdAt","desc");
let voitureRef = db.collection('voiture');
let deleteIDs = [];

// REAL TIME LISTENER
proprioRef.onSnapshot(snapshot => {
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
proprioRef.onSnapshot(snapshot => {
	let size = snapshot.size;
	$('.count').text(size);
	if (size == 0) {
		$('#selectAll').attr('disabled', true);
	} else {
		$('#selectAll').attr('disabled', false);
	}
});


const displayProprios = async (doc) => {
	console.log('displayProprios');

	let proprios = proprioRef;
	// .startAfter(doc || 0).limit(10000)

	const data = await proprios.get();

	data.docs.forEach(doc => {
		const proprio = doc.data();
		let item =
			`<tr data-id="${doc.id}">
					<td>
							<span class="custom-checkbox">
									<input type="checkbox" id="${doc.id}" name="options[]" value="${doc.id}">
									<label for="${doc.id}"></label>
							</span>
					</td>
					<td class="proprio-nom">${proprio.Nom}</td>
					<td class="proprio-cin">${proprio.CIN}</td>
					<td class="proprio-adresse">${proprio.Adresse}</td>
					<td class="proprio-telephone">${proprio.Telephone}</td>
					<td class="proprio-money">${proprio.Money}</td>
					<td>
							<a href="#" id="${doc.id}" class="edit js-edit-proprio"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
							</a>
							<a href="#" id="${doc.id}" class="delete js-delete-proprio"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
							</a>
                    </td>

						<td>
												
						<a href="#" id="${doc.id}" class="listcar js-listcar-proprio"><i class="material-icons" data-toggle="tooltip" title="lister voiture">format_list_bulleted
						</i>
						</a>
						</td>
				</tr>
				`;

		$('#proprio-table').append(item);

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
	const propriosdata = [{
			"Nom": "Kotobe",
			"CIN": "101222111333",
			"Adresse": "Ambatobe",
			"Telephone": "0341122233",
            "Money": "0341100011" 
		}
	];

	propriosdata.forEach(proprio => {
		console.log(proprio);
		db.collection('proprio').add({
				Nom: proprio.Nom,
				CIN: proprio.CIN,
				Adresse: proprio.Adresse,
				Telephone: proprio.Telephone,
                Money: proprio.Money,
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
	displayProprios();

	// LOAD MORE
	$(document).on('click', '.js-loadmore', function () {
		displayProprios(latestDoc);
	});

	// ADD proprio
	$("#add-proprio-form").submit(function (event) {
		event.preventDefault();
		let pro_nom = $('#proprio-nom').val();
		let pro_cin = $('#proprio-cin').val();
		let pro_adr = $('#proprio-adresse').val();
		let pro_tel =  $('#proprio-telephone').val();
        let pro_money = $('#proprio-money').val();
		db.collection('proprio').add({
			Nom: pro_nom,
			CIN: pro_cin,
			Adresse: pro_adr,
			Telephone: pro_tel,
            Money: pro_money,
			createdAt : firebase.firestore.FieldValue.serverTimestamp()
			}).then(function (docRef) {
				console.log("Document written with ID: ", docRef.id);
				$("#addProprioModal").modal('hide');

				let newProprio =
				`<tr data-id="${docRef.id}">
						<td>
								<span class="custom-checkbox">
										<input type="checkbox" id="${docRef.id}" name="options[]" value="${docRef.id}">
										<label for="${docRef.id}"></label>
								</span>
                                
								<a href="#" id="${docRef.id}" class="edit js-edit-proprio"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
								</a>
								<a href="#" id="${docRef.id}" class="delete js-delete-proprio"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
                                </td>

						<td>
												
						<a href="#" id="${docRef.id}" class="listcar js-listcar-proprio"><i class="material-icons" data-toggle="tooltip" title="lister voiture">format_list_bulleted
						</i>
						</a>
						</td>
				</tr>
				`;

			$('#proprio-table tbody').prepend(newProprio);
			})
			.catch(function (error) {
				console.error("Error writing document: ", error);
			});
	});

    // UPDATE proprio
	$(document).on('click','.js-edit-proprio', function (e) {
		e.preventDefault();
		let id = $(this).attr('id');
		$('#edit-proprio-form').attr('edit-id', id);
		db.collection('proprio').doc(id).get().then(function (document) {
			if (document.exists) {
				$('#edit-proprio-form #proprio-nom').val(document.data().Nom);
				$('#edit-proprio-form #proprio-cin').val(document.data().CIN);
				$('#edit-proprio-form #proprio-adresse').val(document.data().Adresse);
				$('#edit-proprio-form #proprio-telephone').val(document.data().Telephone);
				$('#edit-proprio-form #proprio-money').val(document.data().Money);
				$('#editProprioModal').modal('show');
			} else {
				console.log("No such document!");
			}
		}).catch(function (error) {
			console.log("Error getting document:", error);
		});
	});
    
	$("#edit-proprio-form").submit(function (event) {
		event.preventDefault();
		let id = $(this).attr('edit-id');
		let pro_nom = $('#edit-proprio-form #proprio-nom').val();
		let pro_cin = $('#edit-proprio-form #proprio-cin').val();
		let pro_adr = $('#edit-proprio-form #proprio-adresse').val();
		let pro_tel =  $('#edit-proprio-form #proprio-telephone').val();
		let pro_money =  $('#edit-proprio-form #proprio-money').val();

		db.collection('proprio').doc(id).update({
			Nom: pro_nom,
			CIN: pro_cin,
			Adresse: pro_adr,
			Telephone: pro_tel,
            Money: pro_money,
			updatedAt : firebase.firestore.FieldValue.serverTimestamp()
		});

		$('#editProprioModal').modal('hide');

		// SHOW UPDATED DATA ON BROWSER
		$('tr[data-id=' + id + '] td.proprio-nom').html(pro_nom);
		$('tr[data-id=' + id + '] td.proprio-cin').html(pro_cin);
		$('tr[data-id=' + id + '] td.proprio-adresse').html(pro_adr);
		$('tr[data-id=' + id + '] td.proprio-telephone').html(pro_tel);
		$('tr[data-id=' + id + '] td.proprio-money').html(pro_money);
	});
	//lst car
	$(document).on('click','.js-listcar-proprio',async function (e) {
		e.preventDefault();
		let id = $(this).attr('id');
		$('#listCar-proprio-form').attr('select-id', id);
		db.collection('proprio').doc(id).get().then( async function (document) {
			if (document.exists) {
				$('#edit-proprio-form #proprio-cin').val(document.data().CIN);
			 console.log(id);
				var inc = document.data().CIN;
			console.log(inc);
			

			const nic = db.collection('proprio').where('CIN', '==', inc);
			const querySnapshotA =  await nic.get();
			querySnapshotA.forEach((doc) => {
				//console.log(doc.data());
			})
			
			const tricar =  db.collection('voiture').where('cin', '==', inc);
			const querySnapshotB =  await tricar.get();
			querySnapshotB.forEach((doc) => {
				//console.log(doc.data());
			})
			var row = "null";
				if(inc.nic == inc.tricar){
                    querySnapshotB.forEach((doc) => {
                        console.log(doc.data().matricule);
					if ((doc.data().matricule) != "null") {
						row  =  `<ul>
										<li>${doc.data().matricule}</li>
								</ul>`;
						
						$('#listVoit').append(row);
						
					}
					
					})}
					
				$('#listCarProprioModal').modal('show');
				
			};})

		})	

		});

    	// DELETE EMPLOYEE
	$(document).on('click', '.js-delete-proprio', function (e) {
		e.preventDefault();
		let id = $(this).attr('id');
		$('#delete-proprio-form').attr('delete-id', id);
		$('#deleteProprioModal').modal('show');
	});

	$("#delete-proprio-form").submit(function (event) {
		event.preventDefault();
		let id = $(this).attr('delete-id');
		if (id != undefined) {
			db.collection('proprio').doc(id).delete()
				.then(function () {
					console.log("Document successfully delete!");
					$("#deleteProprioModal").modal('hide');
				})
				.catch(function (error) {
					console.error("Error deleting document: ", error);
				});
		} else {
			let checkbox = $('table tbody input:checked');
			checkbox.each(function () {
				db.collection('proprio').doc(this.value).delete()
					.then(function () {
						console.log("Document successfully delete!");
						displayProprio();
					})
					.catch(function (error) {
						console.error("Error deleting document: ", error);
					});
			});
			$("#deleteProprioModal").modal('hide');
		}
	});


$("#addProprioModal").on('hidden.bs.modal', function () {
    $('#add-proprio-form .form-control').val('');

	$("#editPoprioModal").on('hidden.bs.modal', function () {
		$('#edit-proprio-form .form-control').val('');
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
voiturepage.addEventListener('click', (e) => {
    window.location.href = "voiture.html";
    })





let employeeRef = db.collection('coperative').orderBy("createdAt","desc");
let deleteIDs = [];

// REAL TIME LISTENER
employeeRef.onSnapshot(snapshot => {
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
employeeRef.onSnapshot(snapshot => {
	let size = snapshot.size;
	$('.count').text(size);
	if (size == 0) {
		$('#selectAll').attr('disabled', true);
	} else {
		$('#selectAll').attr('disabled', false);
	}
});


const displayEmployees = async (doc) => {
	console.log('displayEmployees');

	let employees = employeeRef;
	// .startAfter(doc || 0).limit(10000)

	const data = await employees.get();

	data.docs.forEach(doc => {
		const employee = doc.data();
		let item =
			`<tr data-id="${doc.id}">
					<td>
							<span class="custom-checkbox">
									<input type="checkbox" id="${doc.id}" name="options[]" value="${doc.id}">
									<label for="${doc.id}"></label>
							</span>
					</td>
					<td class="employee-name">${employee.Nom_Coperative}</td>
					<td class="employee-email">${employee.email}</td>
					<td class="employee-address">${employee.Nom_Responsable}</td>
					<td class="employee-phone">${employee.phone}</td>
					<td>
							<a href="#" id="${doc.id}" class="edit js-edit-employee"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
							</a>
							<a href="#" id="${doc.id}" class="delete js-delete-employee"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
							</a>
							
					</td>
					<td>
												
						<a href="#" id="${doc.id}" class="listcar js-listcar-coop"><i class="material-icons" data-toggle="tooltip" title="lister voiture">format_list_bulleted
						</i>
						</a>
					</td>
			</tr>`;

		$('#employee-table').append(item);

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
	const employeesdata = [{
			"Nom_Responsable": "Ellis",
			"email": "estarcks0@stumbleupon.com",
			"Nom_Responsable": "56 Susan Alley",
			"phone": "559-851-3488"
		}
	];

	employeesdata.forEach(employee => {
		console.log(employee);
		db.collection('coperative').add({
				Nom_Coperative: employee.Nom_Coperative,
				email: employee.email,
				Nom_Responsable: employee.Nom_Responsable,
				phone: employee.phone,
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
	displayEmployees();

	// LOAD MORE
	$(document).on('click', '.js-loadmore', function () {
		displayEmployees(latestDoc);
	});

	// ADD EMPLOYEE
	$("#add-employee-form").submit(function (event) {
		event.preventDefault();
		let employeeName = $('#employee-name').val();
		let employeeEmail = $('#employee-email').val();
		let employeeAddress = $('#employee-address').val();
		let employeePhone =  $('#employee-phone').val();
		db.collection('coperative').add({
			Nom_Coperative: employeeName,
			email: employeeEmail,
			Nom_Responsable: employeeAddress,
			phone: employeePhone,
			createdAt : firebase.firestore.FieldValue.serverTimestamp()
			}).then(function (docRef) {
				console.log("Document written with ID: ", docRef.id);
				$("#addEmployeeModal").modal('hide');

				let newEmployee =
				`<tr data-id="${docRef.id}">
						<td>
								<span class="custom-checkbox">
										<input type="checkbox" id="${docRef.id}" name="options[]" value="${docRef.id}">
										<label for="${docRef.id}"></label>
								</span>
						</td>
						<td class="employee-name">${employeeName}</td>
						<td class="employee-email">${employeeEmail}</td>
						<td class="employee-address">${employeeAddress}</td>
						<td class="employee-phone">${employeePhone}</td>
						<td>
								<a href="#" id="${docRef.id}" class="edit js-edit-employee"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
								</a>
								<a href="#" id="${docRef.id}" class="delete js-delete-employee"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
								</a>
								
						</td>
						<td>
												
						<a href="#" id="${docRef.id}" class="listcar js-listcar-coop"><i class="material-icons" data-toggle="tooltip" title="lister voiture">format_list_bulleted
						</i>
						</a>
						</td>
				</tr>`;

			$('#employee-table tbody').prepend(newEmployee);
			})
			.catch(function (error) {
				console.error("Error writing document: ", error);
			});
	});

	// UPDATE EMPLOYEE
	$(document).on('click', '.js-edit-employee', function (e) {
		e.preventDefault();
		let id = $(this).attr('id');
		$('#edit-employee-form').attr('edit-id', id);
		db.collection('coperative').doc(id).get().then(function (document) {
			if (document.exists) {
				$('#edit-employee-form #employee-name').val(document.data().Nom_Coperative);
				$('#edit-employee-form #employee-email').val(document.data().email);
				$('#edit-employee-form #employee-address').val(document.data().Nom_Responsable);
				$('#edit-employee-form #employee-phone').val(document.data().phone);
				$('#editEmployeeModal').modal('show');
			} else {
				console.log("No such document!");
			}
		}).catch(function (error) {
			console.log("Error getting document:", error);
		});
	});

	$("#edit-employee-form").submit(function (event) {
		event.preventDefault();
		let id = $(this).attr('edit-id');
		let employeeName = $('#edit-employee-form #employee-name').val();
		let employeeEmail = $('#edit-employee-form #employee-email').val();
		let employeeAddress = $('#edit-employee-form #employee-address').val();
		let employeePhone =  $('#edit-employee-form  #employee-phone').val();

		db.collection('coperative').doc(id).update({
			Nom_Coperative: employeeName,
			email: employeeEmail,
			Nom_Responsable: employeeAddress,
			phone: employeePhone,
			updatedAt : firebase.firestore.FieldValue.serverTimestamp()
		});

		$('#editEmployeeModal').modal('hide');

		// SHOW UPDATED DATA ON BROWSER
		$('tr[data-id=' + id + '] td.employee-name').html(employeeName);
		$('tr[data-id=' + id + '] td.employee-email').html(employeeEmail);
		$('tr[data-id=' + id + '] td.employee-address').html(employeeAddress);
		$('tr[data-id=' + id + '] td.employee-phone').html(employeePhone);
	});
		//lst car
		$(document).on('click','.js-listcar-coop',async function (e) {
			e.preventDefault();
			let id = $(this).attr('id');
			$('#listCar-coop-form').attr('select-id', id);
			db.collection('coperative').doc(id).get().then( async function (document) {
				if (document.exists) {
					$('#edit-coop-form #coop-Nom_Coperative').val(document.data().Nom_Coperative);
				 console.log(id);
					var inc = document.data().Nom_Coperative;
				console.log(inc);
				
	
				const nic = db.collection('voiture').where('Nom_Coperative', '==', inc);
				const querySnapshotA =  await nic.get();
				querySnapshotA.forEach((doc) => {
					//console.log(doc.data());
				})
				
				const tricar =  db.collection('voiture').where('Nom_Coperative', '==', inc);
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
							
							$('#listVoitCoop').append(row);
							
						}
						
						})}
						
					$('#listCarCoopModal').modal('show');
					
				};})
	
			})	
	
			});

	// DELETE EMPLOYEE
	$(document).on('click', '.js-delete-employee', function (e) {
		e.preventDefault();
		let id = $(this).attr('id');
		$('#delete-employee-form').attr('delete-id', id);
		$('#deleteEmployeeModal').modal('show');
	});

	$("#delete-employee-form").submit(function (event) {
		event.preventDefault();
		let id = $(this).attr('delete-id');
		if (id != undefined) {
			db.collection('coperative').doc(id).delete()
				.then(function () {
					console.log("Document successfully delete!");
					$("#deleteEmployeeModal").modal('hide');
				})
				.catch(function (error) {
					console.error("Error deleting document: ", error);
				});
		} else {
			let checkbox = $('table tbody input:checked');
			checkbox.each(function () {
				db.collection('coperative').doc(this.value).delete()
					.then(function () {
						console.log("Document successfully delete!");
						displayEmployees();
					})
					.catch(function (error) {
						console.error("Error deleting document: ", error);
					});
			});
			$("#deleteEmployeeModal").modal('hide');
		}
	});

	// SEARCH
	$("#search-name").keyup(function () {
		$('#employee-table tbody').html('');
		let nameKeyword = $("#search-name").val();
		console.log(nameKeyword);
		employeeRef.orderBy('name', 'asc').startAt(nameKeyword).endAt(nameKeyword + "\uf8ff").get()
			.then(function (documentSnapshots) {
				documentSnapshots.docs.forEach(doc => {
					renderEmployee(doc);
				});
			});
	});

	// RESET FORMS
	$("#addEmployeeModal").on('hidden.bs.modal', function () {
		$('#add-employee-form .form-control').val('');
	});

	$("#editEmployeeModal").on('hidden.bs.modal', function () {
		$('#edit-employee-form .form-control').val('');
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

voiturepage.addEventListener('click', (e) => {   
	window.location.href = "voiture.html"; 
	})
propriopage.addEventListener('click', (e) => {
    window.location.href = "proprio.html";
    })
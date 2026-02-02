<?php include('header.php');
 require '../dbconnect.php';

function test_input($data) {
	$data = trim($data);
	$data = stripslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}


if(isset($_POST['submit']))
{

    $username=test_input($_POST['username']);
    $password=test_input($_POST['password']);
    
    
    
     // mysqli_query($con,"INSERT INTO `user_table` (`email_id`,`password`,`fullname`,`gender`,`age`,`mobile`,`city`,`state`) VALUES ('$email_id','$password','$fullname','$gender','$age','$mobile','$city','$state')") or die(mysql_error());
     // header("location:../index.php");

    $statement = $db->prepare("INSERT INTO admin_table (username,password) VALUES (?,?)");
		
	$statement->execute(array($username,$password));
	header("location:../user/accountcreated.php");
} 

?>

			<script>
			function validate_from()
			{
				var x=document.forms["adform"]["username"].value;
				if(x==null || x=="")
				{
					alert("Enter your Username");
					return false;
				}
				x=document.forms["adform"]["password"].value;
				if(x==null || x=="")
				{
					alert("Enter password");
					return false;
				}
				
			}
		</script>
			 
			  <div class="col-md-12 forminput">
				<form name="adform" action="" onsubmit="return validate_from()" method="post" class="form-horizontal" >
				  <div class="form-group">
					<label  class="col-sm-3 control-label">New Admin</label>
					<div class="col-sm-8">
					  <input type="text" class="form-control" id="inputEmail3" placeholder="Username" name="username">
					</div>
				  </div>
				  <div class="form-group">
					<label  class="col-sm-3 control-label">Password</label>
					<div class="col-sm-8">
					  <input type="password" class="form-control" id="inputPassword3" placeholder="Password" name="password">
					</div>
				  </div>
				 
				  <div class="form-group">
					<div class="col-sm-offset-3 col-sm-10">
					  <a><input type="submit" value="Submit" name="submit" /></a>
					</div>
				  </div>
				</form>
				
			  </div>
<?php include('../footer.php'); ?>
 

       
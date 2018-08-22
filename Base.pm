package Web::Base;
use Moose::Role;
use Moose::Util::TypeConstraints;

=head2

	PACKAGE		Web::Base
	
	PURPOSE
	
		BASE METHODS FOR Web
		
=cut

has 'fileroot'	=> ( isa => 'Str|Undef', is => 'rw', default => '' );
#### USE LIB FOR INHERITANCE
use FindBin qw($Bin);
use lib "$Bin/../../";
use Data::Dumper;

##############################################################################
#				DATABASE TABLE METHODS
=head2

	SUBROUTINE		getData
	
	PURPOSE

		RETURN JSON STRING OF ALL WORKFLOWS FOR EACH
		
		PROJECT IN THE application TABLE BELONGING TO
		
		THE USER

	INPUT
	
		1. USERNAME
		
		2. SESSION ID
		
	OUTPUT
		
		1. JSON HASH { "projects":[ {"project": "project1","workflow":"...}], ... }

=cut

sub getData {
#### GET DATA OBJECT
	my $self		=	shift;
	$self->logNote("Common::getData()");
	
	#### DETERMINE IF USER IS ADMIN USER
    my $username 		= $self->username();
	my $isadmin 		= $self->isAdminUser($username);

	#### GET OUTPUT
	my $data;

	### ADMIN-ONLY
	$data->{users} 					= 	$self->getUsers();

	$data->{packages} 			= 	$self->getPackages() if $isadmin;
  $data->{appheadings}    = 	$self->getAppHeadings();
	$data->{apps} 					= 	$self->getApps();
	$data->{parameters} 		= 	$self->getParameters();
	
	#### GENERAL
	$data->{projects} 			= 	$self->getProjects();
	$data->{workflows} 			= 	$self->getWorkflows();
	$data->{groupmembers} 	= 	$self->getGroupMembers();
  $data->{cloudheadings}  = 	$self->getCloudHeadings();

	#### SHARING
  $data->{sharingheadings}= 	$self->getSharingHeadings();
  $data->{access} 				= 	$self->getAccess();
	$data->{groups} 				= 	$self->getGroups();
	$data->{sources} 				= 	$self->getSources();
	#$data->{aguaapps} 			= 	$self->getAguaApps();
	#$data->{aguaparameters}= 	$self->getAguaParameters();
	#$data->{adminapps} 		= 	$self->getAdminApps();
	#$data->{adminparameters} 	= 	$self->getAdminParameters();
	$data->{stages} 				= 	$self->getStages();
	$data->{stageparameters}= 	$self->getStageParameters();
	$data->{views} 					= 	$self->getViews();
	$data->{viewfeatures} 	= 	$self->getViewFeatures();
	$data->{features} 			= 	$self->getFeatures();
	
	#### AMAZON INFO
	$data->{aws} 						= 	$self->getAws();
	$data->{regionzones} 		= 	$self->getRegionZones();

	#### REPO INFO
	$data->{hub} 						= 	$self->_getHub();
	
	#### CONF ENTRIES
	$data->{conf} 					= 	$self->getConf();

	#### CLUSTER INFO
	$data->{amis} 					= 	$self->getAmis();
	$data->{clusters} 			= 	$self->getClusters();
	$data->{clusterworkflows}= 	$self->getClusterWorkflows();

	#### SHARED DATA
	$data->{sharedprojects} = 	$self->getSharedProjects();
	$data->{sharedsources} 	= 	$self->getSharedSources();
	$data->{sharedworkflows}	= 	$self->getSharedWorkflows();
	$data->{sharedstages} 	= 	$self->getSharedStages();
	$data->{sharedstageparameters} = $self->getSharedStageParameters();
	$data->{sharedviews} 		= 	$self->getSharedViews();
	$data->{sharedviewfeatures} = 	$self->getSharedViewFeatures();

	#### CACHES
	$data->{filecaches}			= 	$self->getFileCaches();

	##### REQUEST
	#$data->{queries}				= 	$self->getQueries();
	#$data->{downloads}			= 	$self->getDownloads();

	$self->logDebug("DOING self->notifyStatus(data)");
	$data->{status}				=	"Retrieved data";
	return $self->notifyStatus($data);
}

sub getConf {
	my $self		=	shift;
	
	my $conf;
	$conf->{agua}->{opsrepo} 	=	$self->conf()->getKey($self->application(), "OPSREPO");
	$conf->{agua}->{privateopsrepo} =	$self->conf()->getKey($self->application(), "PRIVATEOPSREPO");
	$conf->{agua}->{appsdir} 	=	$self->conf()->getKey($self->application(), "APPSDIR");
	$conf->{agua}->{installdir}	=	$self->conf()->getKey($self->application(), "INSTALLDIR");
	$conf->{agua}->{reposubdir}	=	$self->conf()->getKey($self->application(), "REPOSUBDIR");
	$conf->{agua}->{repotype}	=	$self->conf()->getKey($self->application(), "REPOTYPE");
	$conf->{agua}->{aguauser}	=	$self->conf()->getKey($self->application(), "AGUAUSER");
	$conf->{agua}->{adminuser}	=	$self->conf()->getKey($self->application(), "ADMINUSER");

	#### SET LOGIN
	my $username = $self->username();
	my $query = qq{SELECT login FROM hub WHERE username='$username'};
	my $login = $self->db()->query($query);
	$self->logDebug("login", $login);
	$conf->{agua}->{login}	=	$login;
	
	return $conf;	
}

sub getTable {
=head2

	SUBROUTINE		getTable
	
	PURPOSE

		RETURN THE JSON STRING FOR ALL USER-RELATED ENTRIES IN
        
        THE DESIGNATED TABLE PROXY NAME (NB: ACTUAL TABLE NAMES
        
        DIFFER -- SOME ARE MISSING THE LAST 'S')

	INPUT
	
		1. USERNAME
		
		2. SESSION ID
        
        3. TABLE PROXY NAME, E.G., "stageParameters" RETURNS RELATED
        
            'stageparameter' TABLE ENTRIES
		
	OUTPUT
		
		1. JSON HASH { "projects":[ {"project": "project1","workflow":"...}], ...}

=cut

	my $self		=	shift;
	$self->logDebug("self->json", $self->json());

    #### VALIDATE    
    $self->logError("User session not validated") and return unless $self->validate();

    my $username = $self->json()->{username};
    my $tablestring = $self->json()->{table};

	my @tables = split ",", $tablestring;
    my $data = {};
	foreach my $table ( @tables )
	{
		#### CONVERT TO get... COMMAND
		my $get = "get" . $self->cowCase($table);
		$self->logNote("get", $get);
		
		#### QUIT IF TABLE PROXY NAME IS INCORRECT
		$self->logError("method $get not defined") and return unless defined $self->can($get);
	
		my $output = $self->$get();
		#$self->logDebug("output", $output);

	    $data->{lc($table)} = $output;
	}
    
	#### PRINT JSON AND EXIT
	use JSON -support_by_pp; 

	my $jsonParser = JSON->new();
    #my $jsonText = $jsonParser->objToJson($data, {pretty => 1, indent => 4});


    my $jsonText = $jsonParser->pretty->indent->encode($data);
    #my $jsonText = $jsonParser->encode($data);

	#### THIS ALSO WORKS
	#my $jsonText = $jsonParser->encode->allow_nonref->pretty->get_utf8->($output);
	####my $apps = $jsonParser->allow_singlequote(1)->allow_nonref->loose(1)->encode($output);

	#### TO AVOID HIJACKING --- DO NOT--- PRINT AS 'json-comment-optional'
	print "$jsonText\n";
	return;
}


1;

